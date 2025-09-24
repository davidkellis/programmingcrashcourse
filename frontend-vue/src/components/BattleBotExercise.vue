<template>
  <div class="battle-bot-exercise">
    <div class="bbe-container">
      <canvas ref="canvasRef" class="bbe-arena" width="800" height="600"></canvas>
      <div class="bbe-sidebar">
        <div class="bbe-controls">
          <div class="bbe-row">
            <label for="bbe-speed">Speed</label>
            <span class="bbe-speed-label">{{ timeScale.toFixed(1) }}x</span>
          </div>
          <input
            id="bbe-speed"
            type="range"
            min="0.1"
            max="3"
            step="0.05"
            v-model.number="timeScale"
          />
          <div class="bbe-actions">
            <button type="button" @click="startNewBattle">New Battle</button>
            <button type="button" @click="runBestOf(3)">Best of 3</button>
          </div>
        </div>
        <div ref="scoreboardRef" class="bbe-scoreboard"></div>
      </div>
    </div>

    <div class="bbe-editor">
      <h3>Write your tank</h3>
      <p class="bbe-help">
        Define a class that extends <code>Tank</code>, then call
        <code>registerUserTank(MyTank, { name: 'Player', color: '#ff7f0e' })</code>. Click Run to
        add it to the roster for the next battle.
      </p>
      <AceCodeBlock :code="userCode" language="javascript" :onRunCode="onRunUserCode" />
    </div>

    <!-- Non-modal outcome is rendered in the scoreboard header -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AceCodeBlock from '@/components/AceCodeBlock.vue'

// ---- Constants ----
const ARENA_WIDTH = 800
const ARENA_HEIGHT = 600
const TANK_SIZE = 20
const TANK_RADIUS = TANK_SIZE / 2
const MAX_SPEED = 5
const MAX_TURN_RATE = 10 // degrees per tick
const BULLET_SPEED = 10
const MAX_POWER = 3
const FIRE_COOLDOWN = 20 // ticks
const RAD_TO_DEG = 180 / Math.PI
const DEG_TO_RAD = Math.PI / 180

// ---- Utilities ----
function normalizeAngle(angle: number): number {
  while (angle > 180) angle -= 360
  while (angle < -180) angle += 360
  return angle
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

// ---- Core classes ----
class Bullet {
  x: number
  y: number
  angle: number
  power: number
  owner: Tank | null
  active: boolean
  constructor(x: number, y: number, angle: number, power: number, owner: Tank | null) {
    this.x = x
    this.y = y
    this.angle = angle
    this.power = power
    this.owner = owner
    this.active = true
  }
  update(dt = 1) {
    this.x += BULLET_SPEED * dt * Math.cos(this.angle * DEG_TO_RAD)
    this.y += BULLET_SPEED * dt * Math.sin(this.angle * DEG_TO_RAD)
    if (this.x < 0 || this.x > ARENA_WIDTH || this.y < 0 || this.y > ARENA_HEIGHT) {
      this.active = false
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI)
    ctx.fillStyle = '#f00'
    ctx.fill()
  }
}

class Tank {
  name: string
  centerX: number
  centerY: number
  heading: number
  energy: number
  speed: number
  turnRate: number
  color: string
  fireCooldown: number
  alive: boolean
  kills: number
  shotsFired: number
  shotsHit: number
  wins: number
  game: Game | null
  _started: boolean
  _driveTarget: {
    x: number
    y: number
    speed: number
    tolerance: number
    stopOnArrive: boolean
  } | null
  _turnTarget: number | null
  _path: Array<{ x: number; y: number }> | null
  _pathIndex: number
  _pathLoop: boolean
  _pathTolerance: number
  _pathSpeed: number
  _prevX: number
  _prevY: number
  constructor(name: string, centerX: number, centerY: number, heading: number, color: string) {
    this.name = name
    this.centerX = centerX
    this.centerY = centerY
    this.heading = heading
    this.energy = 100
    this.speed = 0
    this.turnRate = 0
    this.color = color
    this.fireCooldown = 0
    this.alive = true
    this.kills = 0
    this.shotsFired = 0
    this.shotsHit = 0
    this.wins = 0
    this.game = null
    this._started = false
    this._driveTarget = null
    this._turnTarget = null
    this._path = null
    this._pathIndex = 0
    this._pathLoop = false
    this._pathTolerance = 8
    this._pathSpeed = 3
    this._prevX = centerX
    this._prevY = centerY
  }
  // Hooks
  run() {}
  onStart() {}
  // Controls
  setSpeed(speed: number) {
    this.speed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed))
  }
  turnSteeringWheel(turnRate: number) {
    this.turnRate = Math.max(-MAX_TURN_RATE, Math.min(MAX_TURN_RATE, turnRate))
  }
  ahead(distance: number) {
    this.setSpeed(distance > 0 ? MAX_SPEED : -MAX_SPEED)
  }
  back(distance: number) {
    this.ahead(-distance)
  }
  turnLeft(degrees: number) {
    this.turnSteeringWheel(-Math.abs(degrees))
  }
  turnRight(degrees: number) {
    this.turnSteeringWheel(Math.abs(degrees))
  }
  fire(power: number) {
    if (this.fireCooldown <= 0 && this.alive) {
      power = Math.min(MAX_POWER, Math.max(0.1, power))
      if (this.energy < power) return
      const rad = this.heading * DEG_TO_RAD
      const bulletX = this.centerX + (TANK_SIZE / 2) * Math.cos(rad)
      const bulletY = this.centerY + (TANK_SIZE / 2) * Math.sin(rad)
      if (this.game) this.game.bullets.push(new Bullet(bulletX, bulletY, this.heading, power, this))
      this.fireCooldown = FIRE_COOLDOWN
      this.energy -= power
      if (this.energy < 0) this.energy = 0
      this.shotsFired += 1
    }
  }
  getScannedRobots() {
    const scanned: Array<{ name: string; bearing: number; distance: number; energy: number }> = []
    const arenaTanks = this.game ? this.game.tanks : []
    for (const tank of arenaTanks) {
      if (tank !== this && tank.alive) {
        const dx = tank.centerX - this.centerX
        const dy = tank.centerY - this.centerY
        const dist = distance(this.centerX, this.centerY, tank.centerX, tank.centerY)
        let bearing = Math.atan2(dy, dx) * RAD_TO_DEG - this.heading
        bearing = normalizeAngle(bearing)
        scanned.push({ name: tank.name, bearing, distance: dist, energy: tank.energy })
      }
    }
    scanned.sort((a, b) => a.distance - b.distance)
    return scanned
  }
  getX() {
    return this.centerX
  }
  getY() {
    return this.centerY
  }
  getHeading() {
    return this.heading
  }
  getEnergy() {
    return this.energy
  }
  getPosition() {
    return { x: this.centerX, y: this.centerY }
  }
  getPositionPair() {
    return [this.centerX, this.centerY] as [number, number]
  }
  distanceToTank(other: Tank | null) {
    return other ? distance(this.centerX, this.centerY, other.centerX, other.centerY) : Infinity
  }
  static distanceBetween(t1: Tank | null, t2: Tank | null) {
    return !t1 || !t2 ? Infinity : distance(t1.centerX, t1.centerY, t2.centerX, t2.centerY)
  }
  // Child-friendly helpers
  driveTo(
    x: number,
    y: number,
    options: { speed?: number; tolerance?: number; stopOnArrive?: boolean } = {},
  ) {
    const { speed = MAX_SPEED, tolerance = 6, stopOnArrive = true } = options
    this._driveTarget = { x, y, speed, tolerance, stopOnArrive }
  }
  goForward(
    distanceVal: number,
    options: { speed?: number; tolerance?: number; stopOnArrive?: boolean } = {},
  ) {
    const rad = this.heading * DEG_TO_RAD
    const targetX = this.centerX + distanceVal * Math.cos(rad)
    const targetY = this.centerY + distanceVal * Math.sin(rad)
    this.driveTo(targetX, targetY, options)
  }
  turnTo(angleDeg: number) {
    let a = angleDeg % 360
    if (a < 0) a += 360
    this._turnTarget = a
  }
  facePoint(x: number, y: number) {
    const dx = x - this.centerX
    const dy = y - this.centerY
    let angle = Math.atan2(dy, dx) * RAD_TO_DEG
    if (angle < 0) angle += 360
    this.turnTo(angle)
  }
  followPath(
    points: Array<{ x: number; y: number } | [number, number]>,
    options: { loop?: boolean; speed?: number; tolerance?: number } = {},
  ) {
    const norm = points.map((p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : { x: p.x, y: p.y }))
    this._path = norm
    this._pathIndex = 0
    this._pathLoop = !!options.loop
    this._pathSpeed = options.speed ?? this._pathSpeed
    this._pathTolerance = options.tolerance ?? this._pathTolerance
    this._driveTarget = null
  }
  clearPath() {
    this._path = null
    this._pathIndex = 0
  }
  stop() {
    this._driveTarget = null
    this._turnTarget = null
    this.setSpeed(0)
    this.turnSteeringWheel(0)
  }
  _stepAutopilot() {
    if (this._path && !this._driveTarget) {
      const next = this._path[this._pathIndex]
      if (next)
        this.driveTo(next.x, next.y, { speed: this._pathSpeed, tolerance: this._pathTolerance })
    }
    if (this._turnTarget !== null && this._turnTarget !== undefined) {
      const diff = normalizeAngle(this._turnTarget - this.heading)
      const turn = Math.max(-MAX_TURN_RATE, Math.min(MAX_TURN_RATE, diff))
      this.turnSteeringWheel(turn)
      if (Math.abs(diff) < 2) {
        this.turnSteeringWheel(0)
        this._turnTarget = null
      }
    }
    if (this._driveTarget) {
      const { x, y, speed, tolerance, stopOnArrive } = this._driveTarget
      const dx = x - this.centerX
      const dy = y - this.centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= tolerance) {
        if (stopOnArrive) this.setSpeed(0)
        this._driveTarget = null
        if (this._path) {
          this._pathIndex += 1
          if (this._pathIndex >= this._path.length) {
            if (this._pathLoop && this._path.length > 0) this._pathIndex = 0
            else this.clearPath()
          }
        }
      } else {
        const targetAngle = Math.atan2(dy, dx) * RAD_TO_DEG
        const diff = normalizeAngle(targetAngle - this.heading)
        const turn = Math.max(-MAX_TURN_RATE, Math.min(MAX_TURN_RATE, diff))
        this.turnSteeringWheel(turn)
        this.setSpeed(Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed)))
      }
    }
  }
  update(dt = 1) {
    if (!this.alive) return
    if (!this._started) {
      this._started = true
      try {
        this.onStart()
      } catch (e) {
        console.error('onStart error', this.name, e)
      }
    }
    this.run()
    this._stepAutopilot()
    if (this.energy < 5) {
      this.setSpeed(0)
      this.turnSteeringWheel(0)
    }
    this.heading += this.turnRate * dt
    this.heading = (this.heading + 360) % 360
    const rad = this.heading * DEG_TO_RAD
    this.centerX += this.speed * dt * Math.cos(rad)
    this.centerY += this.speed * dt * Math.sin(rad)
    this.centerX = Math.max(TANK_RADIUS, Math.min(ARENA_WIDTH - TANK_RADIUS, this.centerX))
    this.centerY = Math.max(TANK_RADIUS, Math.min(ARENA_HEIGHT - TANK_RADIUS, this.centerY))
    if (this.fireCooldown > 0) this.fireCooldown = Math.max(0, this.fireCooldown - dt)
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.alive) return
    ctx.save()
    ctx.translate(this.centerX, this.centerY)
    ctx.rotate(this.heading * DEG_TO_RAD)
    ctx.fillStyle = this.color
    ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(TANK_SIZE / 2, 0)
    ctx.stroke()
    ctx.restore()
    ctx.fillStyle = '#000'
    ctx.font = '12px Arial'
    ctx.fillText(this.name, this.centerX - 20, this.centerY - TANK_SIZE / 2 - 5)
    ctx.fillRect(
      this.centerX - TANK_SIZE / 2,
      this.centerY - TANK_SIZE / 2 - 15,
      TANK_SIZE * (this.energy / 100),
      5,
    )
  }
  hitBy(bullet: Bullet) {
    if (distance(this.centerX, this.centerY, bullet.x, bullet.y) < TANK_RADIUS) {
      const damage = bullet.power * 4
      this.energy -= damage
      if (this.energy <= 0) {
        this.energy = 0
        this.alive = false
        if (bullet.owner && bullet.owner !== this) bullet.owner.kills += 1
      }
      bullet.active = false
      if (bullet.owner) {
        bullet.owner.energy += damage / 2
        if (bullet.owner !== this) bullet.owner.shotsHit += 1
      }
    }
  }
}

// Example bots (subset of tanks4.html)
class CircleTank extends Tank {
  run() {
    this.setSpeed(2)
    this.turnSteeringWheel(1)
    const enemies = this.getScannedRobots()
    if (enemies.length > 0) {
      const nearest = enemies[0]!
      if (Math.abs(nearest.bearing) < 8) this.fire(2)
    }
  }
}
class RamTank extends Tank {
  run() {
    const enemies = this.getScannedRobots()
    if (enemies.length > 0) {
      const nearest = enemies[0]
      if (nearest) {
        this.turnSteeringWheel(nearest.bearing / 2)
        this.setSpeed(MAX_SPEED)
        if (nearest.distance < 100) this.fire(3)
      }
    } else {
      this.setSpeed(0)
      this.turnSteeringWheel(0)
    }
  }
}
class BouncingTank extends Tank {
  _bounceTarget: number | null = null
  run() {
    if (this._bounceTarget !== undefined && this._bounceTarget !== null) {
      const diff = normalizeAngle(this._bounceTarget - this.heading)
      const turn = Math.max(-MAX_TURN_RATE, Math.min(MAX_TURN_RATE, diff))
      this.turnSteeringWheel(turn)
      this.setSpeed(0)
      if (Math.abs(diff) < 2) {
        this._bounceTarget = null
        this.turnSteeringWheel(0)
        this.setSpeed(MAX_SPEED)
      }
      return
    }
    this.turnSteeringWheel(0)
    this.setSpeed(MAX_SPEED)
    const rad = this.heading * DEG_TO_RAD
    const nextX = this.centerX + this.speed * Math.cos(rad)
    const nextY = this.centerY + this.speed * Math.sin(rad)
    const hitVertical = nextX <= TANK_RADIUS || nextX >= ARENA_WIDTH - TANK_RADIUS
    const hitHorizontal = nextY <= TANK_RADIUS || nextY >= ARENA_HEIGHT - TANK_RADIUS
    if (hitVertical || hitHorizontal) {
      let newHeading = this.heading
      if (hitVertical && hitHorizontal) newHeading = (this.heading + 180) % 360
      else if (hitVertical) newHeading = normalizeAngle(180 - this.heading)
      else if (hitHorizontal) newHeading = normalizeAngle(-this.heading)
      this._bounceTarget = (newHeading + 360) % 360
      const diffNow = normalizeAngle(this._bounceTarget - this.heading)
      const turnNow = Math.max(-MAX_TURN_RATE, Math.min(MAX_TURN_RATE, diffNow))
      this.turnSteeringWheel(turnNow)
      this.setSpeed(0)
      return
    }
    const enemies = this.getScannedRobots()
    if (enemies.length > 0) {
      const nearest = enemies[0]
      if (nearest && Math.abs(nearest.bearing) < 8) this.fire(2)
    }
  }
}
class PathTank extends Tank {
  onStart() {
    const pad = 60
    const pts = [
      { x: pad, y: pad },
      { x: ARENA_WIDTH - pad, y: pad },
      { x: ARENA_WIDTH - pad, y: ARENA_HEIGHT - pad },
      { x: pad, y: ARENA_HEIGHT - pad },
    ]
    this.followPath(pts, { loop: true, speed: 3, tolerance: 10 })
  }
  run() {
    const enemies = this.getScannedRobots()
    if (enemies.length > 0) {
      const nearest = enemies[0]
      if (nearest) {
        this.turnSteeringWheel(nearest.bearing / 6)
        if (Math.abs(nearest.bearing) < 8) this.fire(2)
      }
    }
  }
}
class SniperTank extends Tank {
  desiredRange = 250
  rangeBuffer = 30
  kiteSpeed = 3
  run() {
    if (!this.game) return
    const enemies = this.game.tanks.filter((t) => t !== this && t.alive)
    if (enemies.length === 0) {
      this.setSpeed(0)
      this.turnSteeringWheel(1)
      return
    }
    enemies.sort(
      (a, b) =>
        distance(this.centerX, this.centerY, a.centerX, a.centerY) -
        distance(this.centerX, this.centerY, b.centerX, b.centerY),
    )
    const target = enemies[0]!
    this.facePoint(target.centerX, target.centerY)
    const distTo = distance(this.centerX, this.centerY, target.centerX, target.centerY)
    if (distTo < this.desiredRange - this.rangeBuffer) this.setSpeed(-MAX_SPEED)
    else if (distTo > this.desiredRange + this.rangeBuffer)
      this.setSpeed(Math.min(MAX_SPEED, this.kiteSpeed))
    else this.setSpeed(0)
    const dx = target.centerX - this.centerX
    const dy = target.centerY - this.centerY
    const targetAngle = Math.atan2(dy, dx) * RAD_TO_DEG
    const diff = normalizeAngle(targetAngle - this.heading)
    if (Math.abs(diff) < 6) this.fire(3)
  }
}

// ---- Game class ----
type RosterItem = {
  cls: new (name: string, centerX: number, centerY: number, heading: number, color: string) => Tank
  name: string
  color: string
  heading: number
}

class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scoreboardEl: HTMLElement
  tanks: Tank[] = []
  bullets: Bullet[] = []
  roster: RosterItem[] = []
  _stopped = false
  _lastTime = 0
  timeScale = 1
  prevAliveCount = 0
  drawTimeoutMs = 10000
  lastKillAt = 0
  statusMessageHtml = ''
  // trials
  _trialActive = false
  _trialsRemaining = 0
  _trialWinCounts: Record<string, number> = {}
  constructor(canvas: HTMLCanvasElement, scoreboard: HTMLElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2d context missing')
    this.ctx = ctx
    this.scoreboardEl = scoreboard
  }
  addTank(t: Tank) {
    t.game = this
    this.tanks.push(t)
    return t
  }
  getRandomSpawnPosition(minDistance = TANK_SIZE * 1.8, margin = TANK_RADIUS + 10) {
    let attempts = 0
    while (attempts++ < 1000) {
      const x = margin + Math.random() * (ARENA_WIDTH - 2 * margin)
      const y = margin + Math.random() * (ARENA_HEIGHT - 2 * margin)
      let ok = true
      for (const t of this.tanks) {
        if (distance(x, y, t.centerX, t.centerY) < minDistance) {
          ok = false
          break
        }
      }
      if (ok) return { x, y }
    }
    return {
      x: margin + Math.random() * (ARENA_WIDTH - 2 * margin),
      y: margin + Math.random() * (ARENA_HEIGHT - 2 * margin),
    }
  }
  updateScoreboard() {
    const sb = this.scoreboardEl
    let html = '<h3>Scoreboard</h3>'
    if (this.statusMessageHtml) {
      html += `<div class="sb-message">${this.statusMessageHtml}</div>`
    }
    html += '<div class="sb-list">'
    for (const t of this.tanks) {
      const status = t.alive ? 'Alive' : 'Destroyed'
      const acc = t.shotsFired > 0 ? Math.round((t.shotsHit / t.shotsFired) * 100) : 0
      const energyPct = Math.max(0, Math.min(100, t.energy))
      const useTrialWins = Object.keys(this._trialWinCounts).length > 0 || this._trialActive
      const winsDisplay = useTrialWins ? this._trialWinCounts[t.name] || 0 : t.wins
      html += `
        <div class="sb-entry">
          <div class="sb-row">
            <div class="sb-left">
              <span class="sb-dot" style="background:${t.color}"></span>
              <strong>${t.name}</strong>
            </div>
            <span class="sb-status">${status}</span>
          </div>
          <div class="sb-bar"><span style="width:${energyPct}%;"></span></div>
          <div class="sb-meta">
            Energy: ${Math.round(t.energy)} | Kills: ${t.kills} | Shots: ${t.shotsFired} | Hits: ${t.shotsHit} | Acc: ${acc}% | Wins: ${winsDisplay}
          </div>
        </div>
      `
    }
    html += '</div>'
    sb.innerHTML = html
  }
  resolveCollisions() {
    for (let i = 0; i < this.tanks.length; i++) {
      for (let j = i + 1; j < this.tanks.length; j++) {
        const t1 = this.tanks[i]
        const t2 = this.tanks[j]
        if (!t1 || !t2 || !t1.alive || !t2.alive) continue
        const distVal = distance(t1.centerX, t1.centerY, t2.centerX, t2.centerY)
        const minDist = TANK_SIZE
        if (distVal < minDist && distVal > 0) {
          const overlap = minDist - distVal
          const dx = t2.centerX - t1.centerX
          const dy = t2.centerY - t1.centerY
          const pushX = (dx / distVal) * (overlap / 2)
          const pushY = (dy / distVal) * (overlap / 2)
          t1.centerX -= pushX
          t1.centerY -= pushY
          t2.centerX += pushX
          t2.centerY += pushY
          t1.centerX = Math.max(TANK_RADIUS, Math.min(ARENA_WIDTH - TANK_RADIUS, t1.centerX))
          t1.centerY = Math.max(TANK_RADIUS, Math.min(ARENA_HEIGHT - TANK_RADIUS, t1.centerY))
          t2.centerX = Math.max(TANK_RADIUS, Math.min(ARENA_WIDTH - TANK_RADIUS, t2.centerX))
          t2.centerY = Math.max(TANK_RADIUS, Math.min(ARENA_HEIGHT - TANK_RADIUS, t2.centerY))
        }
      }
    }
  }
  _updateBullets(dt: number) {
    this.bullets.forEach((b) => b.update(dt))
    this.bullets = this.bullets.filter((b) => b.active)
    for (const bullet of this.bullets) {
      for (const tank of this.tanks) {
        if (tank.alive && tank !== (bullet.owner as Tank)) tank.hitBy(bullet)
      }
    }
  }
  _draw() {
    this.ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT)
    this.tanks.forEach((t) => t.draw(this.ctx))
    this.bullets.forEach((b) => b.draw(this.ctx))
  }
  _now() {
    return typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now()
  }
  _loop = () => {
    if (this._stopped) return
    const now = this._now()
    if (this._lastTime === 0) this._lastTime = now
    const dt = ((now - this._lastTime) / (1000 / 60)) * (this.timeScale || 1)
    this._lastTime = now
    this.tanks.forEach((t) => t.update(dt))
    this.resolveCollisions()
    this._updateBullets(dt)
    this.updateScoreboard()
    const alive = this.tanks.filter((t) => t.alive)
    if (this.prevAliveCount === 0) this.prevAliveCount = alive.length
    if (alive.length < this.prevAliveCount) this.lastKillAt = now
    this.prevAliveCount = alive.length
    let winners: string[] | null = null
    let isDraw = false
    if (alive.length <= 1) winners = [alive[0] ? alive[0].name : 'None']
    else if (now - this.lastKillAt >= this.drawTimeoutMs) {
      winners = alive.map((t) => t.name)
      isDraw = true
    }
    if (winners) {
      this._stopped = true
      onBattleFinished(winners, isDraw)
      return
    }
    this._draw()
    requestAnimationFrame(this._loop)
  }
  start() {
    this._stopped = false
    this.updateScoreboard()
    requestAnimationFrame(this._loop)
  }
  setDefaultRoster() {
    this.roster = [
      { cls: CircleTank, name: 'CircleBot', color: '#00f', heading: 0 },
      { cls: RamTank, name: 'Rammer', color: '#f00', heading: 180 },
      { cls: BouncingTank, name: 'Bouncer', color: '#0a0', heading: 90 },
      { cls: PathTank, name: 'Pathy', color: '#9050ff', heading: 0 },
      { cls: SniperTank, name: 'Sniper', color: '#222', heading: 0 },
    ]
  }
  spawnRoster() {
    this.tanks = []
    for (const item of this.roster) {
      const p = this.getRandomSpawnPosition()
      const t = new item.cls(item.name, p.x, p.y, item.heading, item.color)
      this.addTank(t)
    }
  }
  startNewBattle() {
    this._stopped = true
    this.bullets = []
    this.tanks = []
    if (!this._trialActive) this._trialWinCounts = {}
    this.statusMessageHtml = ''
    this.spawnRoster()
    this._stopped = false
    this.prevAliveCount = this.tanks.filter((t) => t.alive).length
    this.lastKillAt = this._now()
    this._lastTime = this.lastKillAt
    this.updateScoreboard()
    requestAnimationFrame(this._loop)
  }
}

// ---- Component state ----
const canvasRef = ref<HTMLCanvasElement | null>(null)
const scoreboardRef = ref<HTMLElement | null>(null)
const timeScale = ref(0.5)
let game: Game | null = null

function onBattleFinished(winners: string[], isDraw = false) {
  // Award wins
  const winnerSet = new Set(winners)
  for (const t of game?.tanks || []) {
    if (winnerSet.has(t.name) && t.name !== 'None') t.wins += 1
  }
  // Trials handling mirrors tanks4.html but simplified
  if (trialActive.value) {
    for (const name of winners) {
      if (!name || name === 'None') continue
      trialWinCounts.value[name] = (trialWinCounts.value[name] || 0) + 1
    }
    game?.updateScoreboard()
    trialsRemaining.value -= 1
    if (trialsRemaining.value > 0) setTimeout(() => startNewBattle(), 400)
    else {
      trialActive.value = false
      let bestName = 'None'
      let bestWins = -1
      for (const [name, wins] of Object.entries(trialWinCounts.value)) {
        if (wins > bestWins) {
          bestName = name
          bestWins = wins
        }
      }
      const lines =
        Object.entries(trialWinCounts.value)
          .map(([name, wins]) => `${name}: ${wins} win${wins === 1 ? '' : 's'}`)
          .join('<br/>') || 'No winners'
      const body = `Champion (best of 3): <strong>${bestName}</strong><br/><br/>Results:<br/>${lines}`
      if (game) {
        game.statusMessageHtml = body
        game.updateScoreboard()
      }
    }
  } else {
    game?.updateScoreboard()
    if (isDraw) {
      const list = winners && winners.length ? winners.join(', ') : 'None'
      const body = `No tank destroyed for 10 seconds.<br/>Survivors (win +1): <strong>${list}</strong>`
      if (game) {
        game.statusMessageHtml = body
        game.updateScoreboard()
      }
    } else {
      const name = winners[0] || 'None'
      const body = name === 'None' ? 'No survivors.' : `Winner: <strong>${name}</strong>`
      if (game) {
        game.statusMessageHtml = body
        game.updateScoreboard()
      }
    }
  }
}

// Trials state
const trialActive = ref(false)
const trialsRemaining = ref(0)
const trialWinCounts = ref<Record<string, number>>({})

// ---- Public controls bound to UI ----
function startNewBattle() {
  if (!game) return
  if (game) game.statusMessageHtml = ''
  game.startNewBattle()
}
function runBestOf(n = 3) {
  if (!game) return
  if (game) game.statusMessageHtml = ''
  trialActive.value = true
  trialsRemaining.value = n
  trialWinCounts.value = {}
  game.startNewBattle()
}

// ---- User editor integration ----
const defaultUserCode = `// Example: define your own tank class and register it
class PlayerTank extends Tank {
  onStart() {
    // Called once when the battle begins
  }
  run() {
    const seen = this.getScannedRobots()
    if (seen.length) {
      const target = seen[0]
      // Turn toward nearest target and move
      this.turnSteeringWheel(target.bearing / 3)
      this.setSpeed(3)
      if (Math.abs(target.bearing) < 6) this.fire(2)
    }
  }
}

// Add to the roster for the next battle:
registerUserTank(PlayerTank, { name: 'Player', color: '#ff7f0e' })
`
const userCode = ref<string>(defaultUserCode)

// Keep last registered user tank descriptor
let userTankDescriptor: RosterItem | null = null

function registerUserTank(
  cls: new (name: string, centerX: number, centerY: number, heading: number, color: string) => Tank,
  options: { name?: string; color?: string; heading?: number } = {},
) {
  if (typeof cls !== 'function') throw new Error('registerUserTank expects a class (function)')
  // Ensure subclass of Tank
  const proto = cls.prototype
  const isSubclass =
    proto &&
    (proto instanceof Tank || proto.__proto__ === Tank.prototype || Tank.isPrototypeOf(cls))
  // Fallback check: methods existence
  if (!isSubclass && !(proto && typeof proto.run === 'function')) {
    throw new Error('Provided class must extend Tank')
  }
  const name = options.name || 'Player'
  const color = options.color || '#ff7f0e'
  const heading = options.heading ?? 0
  userTankDescriptor = { cls, name, color, heading }
  // Insert or replace in roster
  if (game) {
    // remove previous user entries by name to avoid duplicates
    game.roster = game.roster.filter((r) => r.name !== name || r.cls !== cls)
    game.roster.push(userTankDescriptor)
    game.updateScoreboard()
  }
}

function onRunUserCode(code: string) {
  try {
    const fn = new Function(
      'Tank',
      'registerUserTank',
      'MAX_SPEED',
      'ARENA_WIDTH',
      'ARENA_HEIGHT',
      'normalizeAngle',
      'distance',
      `"use strict";\n${code}`,
    )
    fn(Tank, registerUserTank, MAX_SPEED, ARENA_WIDTH, ARENA_HEIGHT, normalizeAngle, distance)
  } catch (e) {
    const err = e as unknown as { message?: string }
    console.error('User code error:', e)
    if (game) {
      game.statusMessageHtml = `User Code Error: ${String(err && err.message ? err.message : e)}`
      game.updateScoreboard()
    }
  }
}

// ---- Lifecycle ----
onMounted(() => {
  if (!canvasRef.value || !scoreboardRef.value) return
  game = new Game(canvasRef.value, scoreboardRef.value)
  game.setDefaultRoster()
  // Bind timescale
  const updateScale = () => {
    if (game) game.timeScale = timeScale.value
  }
  updateScale()
  // quickly keep in sync by polling reactive variable change
  const scaleInt = setInterval(updateScale, 100)
  ;(onUnmounted as unknown as (fn: () => void) => void)(() => clearInterval(scaleInt))
  game.startNewBattle()
})

onUnmounted(() => {
  // stop loop by flag
  if (game) (game as unknown as { _stopped?: boolean })._stopped = true
})
</script>

<style scoped>
.battle-bot-exercise {
  width: 100%;
}

/* Full-bleed centering: allow the arena+sidebar to extend beyond the
   tutorial text column but remain centered in the viewport. */
.battle-bot-exercise :global(.battle-bot-mount),
.battle-bot-exercise :global(.battle-bot-exercise) {
  display: block;
}
/* No extra full-bleed hack here; mount handles full-bleed centering. */

/* Center inner container horizontally at natural width */
.bbe-container {
  margin: 0 auto;
}
.battle-bot-exercise {
  width: 100%;
}
.bbe-container {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.bbe-arena {
  border: 2px solid #000;
  background: #fff;
}
.bbe-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bbe-controls {
  width: 360px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 10px 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  font-family: Arial, Helvetica, sans-serif;
}
.bbe-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 6px;
}
.bbe-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.bbe-actions button {
  padding: 6px 10px;
  border: 1px solid #333;
  background: #f7f7f7;
  border-radius: 4px;
  cursor: pointer;
}
.bbe-actions button:hover {
  background: #eee;
}
.bbe-scoreboard {
  width: 360px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 10px 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  font-family: Arial, Helvetica, sans-serif;
}
.bbe-scoreboard .sb-message {
  background: #fff7e6;
  border: 1px solid #f3d19c;
  color: #7a4b00;
  padding: 6px 8px;
  border-radius: 4px;
  margin: 6px 0 10px 0;
}
.bbe-scoreboard h3 {
  margin: 6px 0 10px 0;
  font-size: 18px;
}
.sb-entry {
  margin-bottom: 10px;
}
.sb-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}
.sb-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sb-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #333;
  flex: 0 0 12px;
}
.sb-status {
  font-size: 12px;
  color: #555;
}
.sb-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}
.sb-bar > span {
  display: block;
  height: 100%;
  background: #4caf50;
}
.sb-meta {
  font-size: 12px;
  color: #333;
  margin-top: 4px;
  white-space: nowrap;
}

.bbe-editor {
  margin-top: 16px;
}
.bbe-editor h3 {
  margin: 8px 0;
}
.bbe-help {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 0.95rem;
}

.bbe-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}
.bbe-banner {
  width: 360px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}
.bbe-banner h2 {
  margin: 6px 0 8px 0;
  font-size: 20px;
}
.bbe-banner-body {
  font-size: 14px;
  color: #333;
  margin-top: 4px;
}
.bbe-banner-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}
.bbe-banner-actions button {
  padding: 8px 10px;
  border: 1px solid #333;
  background: #f7f7f7;
  border-radius: 4px;
  cursor: pointer;
}
.bbe-banner-actions button:hover {
  background: #eee;
}

@media (max-width: 980px) {
  .bbe-container {
    flex-direction: column;
    align-items: center;
  }
  .bbe-sidebar {
    width: 800px;
    max-width: 100%;
    flex-direction: row;
  }
  .bbe-controls,
  .bbe-scoreboard {
    width: 100%;
  }
}
</style>
