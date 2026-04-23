import kaplay from "kaplay";

kaplay({
    width: 400,
    height: 700,
    background: [26, 26, 46],
    scale: 1,
    crisp: true,
});

const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 12;
const BALL_SPEED = 400;
const GRAVITY = 800;
const BUMPER_RADIUS = 30;

let score = 0;
let lives = 3;
let gameStarted = false;
let gameOver = false;

scene("game", () => {
    score = 0;
    lives = 3;
    gameOver = false;

    add([
        rect(width(), 20),
        pos(0, 0),
        color(100, 50, 150),
        area(),
        "wall",
    ]);

    add([
        rect(20, height()),
        pos(0, 0),
        color(100, 50, 150),
        area(),
        "wall",
    ]);

    add([
        rect(20, height()),
        pos(width() - 20, 0),
        color(100, 50, 150),
        area(),
        "wall",
    ]);

    const leftFlipper = add([
        rect(PADDLE_WIDTH, PADDLE_HEIGHT),
        pos(60, height() - 100),
        anchor("left"),
        color(255, 100, 50),
        area(),
        rotate(20),
        "flipper",
        "leftFlipper",
    ]);

    const rightFlipper = add([
        rect(PADDLE_WIDTH, PADDLE_HEIGHT),
        pos(width() - 60, height() - 100),
        anchor("right"),
        color(255, 100, 50),
        area(),
        rotate(-20),
        "flipper",
        "rightFlipper",
    ]);

    const bumper1 = add([
        circle(BUMPER_RADIUS),
        pos(width() / 2, height() / 3),
        color(50, 255, 150),
        area(),
        "bumper",
        { hitTime: 0 },
    ]);

    const bumper2 = add([
        circle(BUMPER_RADIUS),
        pos(width() / 3, height() / 2),
        color(50, 200, 255),
        area(),
        "bumper",
        { hitTime: 0 },
    ]);

    const bumper3 = add([
        circle(BUMPER_RADIUS),
        pos((width() * 2) / 3, height() / 2),
        color(150, 100, 255),
        area(),
        "bumper",
        { hitTime: 0 },
    ]);

    const angledWallLeft = add([
        rect(200, 15),
        pos(0, height() - 180),
        rotate(-30),
        color(150, 50, 200),
        area(),
        "wall",
    ]);

    const angledWallRight = add([
        rect(200, 15),
        pos(width() - 200, height() - 180),
        rotate(30),
        color(150, 50, 200),
        area(),
        "wall",
    ]);

    const ball = add([
        circle(BALL_RADIUS),
        pos(width() / 2, height() / 4),
        color(255, 255, 200),
        area(),
        "ball",
        {
            vel: vec2(0, 0),
        },
    ]);

    function launchBall() {
        const angle = (Math.random() * 0.5 + 0.25) * Math.PI;
        ball.pos = vec2(width() / 2, height() / 4);
        ball.vel = vec2(Math.cos(angle) * BALL_SPEED, -Math.sin(angle) * BALL_SPEED);
    }

    onKeyPress("space", () => {
        if (!gameStarted && !gameOver) {
            gameStarted = true;
            launchBall();
        }
    });

    onTouchStart(() => {
        if (!gameStarted && !gameOver) {
            gameStarted = true;
            launchBall();
        }
    });

    onKeyDown("left", () => {
        if (gameStarted && !gameOver) {
            leftFlipper.angle = -30;
        }
    });

    onKeyRelease("left", () => {
        leftFlipper.angle = 20;
    });

    onKeyDown("right", () => {
        if (gameStarted && !gameOver) {
            rightFlipper.angle = 30;
        }
    });

    onKeyRelease("right", () => {
        rightFlipper.angle = -20;
    });

    onUpdate(() => {
        if (gameOver) return;

        ball.vel.y += GRAVITY * dt();

        const touchLeft = isTouchDown() && touchPos().x < width() / 2;
        const touchRight = isTouchDown() && touchPos().x >= width() / 2;

        if (touchLeft) {
            leftFlipper.angle = -30;
        } else {
            leftFlipper.angle = 20;
        }

        if (touchRight) {
            rightFlipper.angle = 30;
        } else {
            rightFlipper.angle = -20;
        }

        ball.pos.x += ball.vel.x * dt();
        ball.pos.y += ball.vel.y * dt();

        if (ball.pos.x - BALL_RADIUS < 20) {
            ball.pos.x = 20 + BALL_RADIUS;
            ball.vel.x = Math.abs(ball.vel.x) * 0.9;
            score += 10;
        }

        if (ball.pos.x + BALL_RADIUS > width() - 20) {
            ball.pos.x = width() - 20 - BALL_RADIUS;
            ball.vel.x = -Math.abs(ball.vel.x) * 0.9;
            score += 10;
        }

        if (ball.pos.y - BALL_RADIUS < 20) {
            ball.pos.y = 20 + BALL_RADIUS;
            ball.vel.y = Math.abs(ball.vel.y) * 0.9;
            score += 10;
        }

        const flippers = get("flipper");
        for (const flipper of flippers) {
            const dx = ball.pos.x - flipper.pos.x;
            const dy = ball.pos.y - flipper.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const flipperHeight = 15;

            if (dy > 0 && dy < flipperHeight && Math.abs(dx) < PADDLE_WIDTH / 2 + BALL_RADIUS) {
                if (flipper.is("leftFlipper")) {
                    ball.vel.y = -Math.abs(ball.vel.y) - 200;
                    ball.vel.x = Math.min(ball.vel.x + 100, 300);
                    ball.pos.y = flipper.pos.y - BALL_RADIUS - 1;
                } else {
                    ball.vel.y = -Math.abs(ball.vel.y) - 200;
                    ball.vel.x = Math.max(ball.vel.x - 100, -300);
                    ball.pos.y = flipper.pos.y - BALL_RADIUS - 1;
                }
            }
        }

        const bumpers = get("bumper");
        for (const bumper of bumpers) {
            const dx = ball.pos.x - bumper.pos.x;
            const dy = ball.pos.y - bumper.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < BUMPER_RADIUS + BALL_RADIUS) {
                const angle = Math.atan2(dy, dx);
                const speed = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);
                const newSpeed = Math.max(speed, 300);

                ball.vel.x = Math.cos(angle) * newSpeed;
                ball.vel.y = Math.sin(angle) * newSpeed;

                const overlap = BUMPER_RADIUS + BALL_RADIUS - dist;
                ball.pos.x += Math.cos(angle) * overlap;
                ball.pos.y += Math.sin(angle) * overlap;

                score += 100;
                bumper.hitTime = time();
            }
        }

        if (ball.pos.y > height() + 50) {
            lives--;
            if (lives <= 0) {
                gameOver = true;
            } else {
                launchBall();
            }
        }
    });

    add([
        text("SCORE: 0", { size: 24 }),
        pos(20, 30),
        color(255, 255, 255),
        "scoreText",
        { lastScore: 0 },
    ]);

    add([
        text("LIVES: 3", { size: 20 }),
        pos(width() - 120, 30),
        color(255, 100, 100),
        "livesText",
    ]);

    onUpdate("scoreText", (txt) => {
        if (score !== txt.lastScore) {
            txt.text = `SCORE: ${score}`;
            txt.lastScore = score;
        }
    });

    onUpdate("livesText", (txt) => {
        txt.text = `LIVES: ${lives}`;
    });

    onDraw(() => {
        const bumpers = get("bumper");
        for (const bumper of bumpers) {
            const elapsed = time() - bumper.hitTime;
            if (elapsed < 0.15) {
                drawCircle({
                    pos: bumper.pos,
                    radius: BUMPER_RADIUS + 10 * (1 - elapsed / 0.15),
                    color: rgb(255, 255, 100),
                });
            }
        }
    });

    onDraw(() => {
        if (!gameStarted && !gameOver) {
            drawText({
                text: "KAPLAY PINBALL",
                pos: vec2(width() / 2, height() / 3),
                size: 32,
                color: rgb(255, 255, 255),
                anchor: "center",
            });
            drawText({
                text: "Press SPACE or Tap to start",
                pos: vec2(width() / 2, height() / 2),
                size: 20,
                color: rgb(200, 200, 200),
                anchor: "center",
            });
        }

        if (gameOver) {
            drawRect({
                pos: vec2(width() / 2 - 120, height() / 2 - 80),
                width: 240,
                height: 160,
                color: rgb(30, 30, 60),
                anchor: "center",
                radius: 10,
            });
            drawText({
                text: "GAME OVER",
                pos: vec2(width() / 2, height() / 2 - 40),
                size: 28,
                color: rgb(255, 100, 100),
                anchor: "center",
            });
            drawText({
                text: `Score: ${score}`,
                pos: vec2(width() / 2, height() / 2),
                size: 24,
                color: rgb(255, 255, 255),
                anchor: "center",
            });
            drawText({
                text: "Tap to restart",
                pos: vec2(width() / 2, height() / 2 + 40),
                size: 18,
                color: rgb(180, 180, 180),
                anchor: "center",
            });
        }
    });

    onClick(() => {
        if (gameOver) {
            go("game");
        }
    });
});

go("game");