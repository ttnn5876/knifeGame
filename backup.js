var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies
    Body = Matter.Body

// create engine
var engine = Engine.create({
    timing: {
        timeScale: 2
    }
})
world = engine.world

LEVELS = [
    {
        // LEVEL 1
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 4),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT / 2, 10, 200, {
            isStatic: true, render: {
            sprite: {
                texture: './img/target.png',
                xScale: 0.2,
                yScale: 0.4
            }
        }
        }, ),
        obstacles: [{}, {}]
    },
    {
        // LEVEL 2
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 5),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT - (SCREEN_HEIGHT / 4), 10, 200, {
            isStatic: true, render: {
            sprite: {
                texture: './img/target.png',
                xScale: 0.2,
                yScale: 0.4
            }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3, 200, 200, { isStatic: true, chamfer: { radius: 20 }}),
            Bodies.rectangle(SCREEN_WIDTH / 2, (SCREEN_HEIGHT / 3) + 350, 200, 200, { isStatic: true, chamfer: { radius: 20 }})
        ]
    },
    {
        // LEVEL 3
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 5),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT / 2, 10, 250, {
            isStatic: true, render: {
            sprite: {
                texture: './img/target.png',
                xScale: 0.2,
                yScale: 0.5
            }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH - 650, SCREEN_HEIGHT - (SCREEN_HEIGHT / 3), 600, 200, { isStatic: true, chamfer: { radius: 20 }}),
            Bodies.rectangle(SCREEN_WIDTH - 650, SCREEN_HEIGHT - (SCREEN_HEIGHT / 3) - 350, 600, 200, { isStatic: true, chamfer: { radius: 20 }})
        ]
    },
    {
        // LEVEL 4
        knife: false,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 5),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT / 2, 10, 250, {
            isStatic: true, render: {
            sprite: {
                texture: './img/target.png',
                xScale: 0.2,
                yScale: 0.5
            }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH - 400, SCREEN_HEIGHT - (SCREEN_HEIGHT / 3), 400, 200, { isStatic: true, chamfer: { radius: 20 }}),
            Bodies.rectangle(SCREEN_WIDTH - 400, SCREEN_HEIGHT - (SCREEN_HEIGHT / 3) - 250, 400, 200, { isStatic: true, chamfer: { radius: 20 }})
        ]
    },
]

KNIFE_MASS = 20

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        wireframes: false,
        showAngleIndicator: false,
        background: "#ebb14d",
        showDebug: true,
    }
})

Render.run(render)

// create runner
var runner = Runner.create()
Runner.run(runner, engine)

var mouse = Mouse.create(render.canvas)

function level(level) {
    
    // Ground
    var ground = Bodies.rectangle((SCREEN_WIDTH) / 2, SCREEN_HEIGHT, SCREEN_WIDTH, 25, { isStatic: true })

    // Knife
    knifeOptions = {
        // density: 0.004,
        density: 0.5,
        render: {
            sprite: {
                texture: './img/knife.png',
                xScale: 0.2,
                yScale: 0.2
            }
        }
    }

    knife = Bodies.polygon(SCREEN_WIDTH - level.sling_x, level.sling_y, 8, KNIFE_MASS, knifeOptions)

    // Target
    var target = level.target

    // Sling
    anchor = { x: SCREEN_WIDTH - level.sling_x, y: level.sling_y },
    elastic = Constraint.create({ 
        pointA: anchor, 
        bodyB: knife, 
        stiffness: 0.1,
        render: {
            visible: true
        },
        length: 2
    })

    World.add(engine.world, [ground, elastic, target, level.obstacles[0], level.obstacles[1]])
    if (level.knife) {
        World.add(engine.world, [knife])
    }

    Events.on(engine, 'afterUpdate', function() {

        if (mouseConstraint.mouse.button === -1 && (knife.position.x > (SCREEN_WIDTH - level.sling_x) + 20 || knife.position.y < level.sling_y - 20)) {
            elastic.stiffness = 1
            knife = Bodies.polygon(SCREEN_WIDTH - level.sling_x, level.sling_y, 8, KNIFE_MASS, knifeOptions)

            if (level.knife) {
                World.add(engine.world, knife)
            }
            elastic.bodyB = knife
        }
        elastic.stiffness = 0.1

        // Get the direction to the target
        const dx = anchor.x - knife.position.x
        const dy = anchor.y - knife.position.y

        // Calculate the angle using atan2
        const angle = Math.atan2(dy, dx);

        // Set the body's angle
        Body.setAngle(elastic.bodyB, angle);
        
    })

    // add mouse control
    mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
})

World.add(world, mouseConstraint)

// keep the mouse in sync with rendering
render.mouse = mouse
}

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: SCREEN_WIDTH, y: SCREEN_HEIGHT }
})

var levelIndex = 0

function nextLevel() {
    if (levelIndex >= LEVELS.length) {
        console.log("Finish logic")
        return
    }

    Composite.clear(world, false, true)

    const levelObj = LEVELS[levelIndex]
    console.log(`Starting ${levelIndex}`)
    level(levelObj)

    const collisionListener = Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair
            const target = levelObj.target

            if (bodyA === target) {
                if (bodyB.angle >= Math.PI / 2 || bodyB.angle <= -Math.PI / 2)
                {
                    return
                }

                Body.setVelocity(bodyB, { x: 0, y: 0 })
                Body.setStatic(bodyB, true)
                runner.enabled = false
                Events.off(engine, 'collisionStart', collisionListener)

                setTimeout(() => {
                    levelIndex++
                    runner.enabled = true
                    nextLevel()
                }, 2000)

            }
        })
    })
}

nextLevel()