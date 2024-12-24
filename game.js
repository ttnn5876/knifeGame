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

function updateText(newText) {
    const textElement = document.getElementById('Text');
    textElement.innerHTML = newText;
}

// create engine
var engine = Engine.create({
    timing: {
        timeScale: 2
    }
})
world = engine.world

console.log(window.innerWidth, window.innerHeight)
SCREEN_WIDTH = window.innerWidth
SCREEN_HEIGHT = window.innerHeight - (window.innerHeight / 965 * 200)

OBSTACLE_RENDER = {
    fillStyle: "#ada587"
}
LEVELS = [
    {
        // LEVEL 1
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 4),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT / 2, 10, SCREEN_HEIGHT / 965 * 200, {
            isStatic: true, 
            render: {
                sprite: {
                    texture: './img/target.png',
                    xScale: SCREEN_WIDTH / 1920 * 0.3,
                    yScale: SCREEN_HEIGHT / 965 * 0.4
                }
        }
        }, ),
        obstacles: [{}, {}],
        init_message: "Throw some knives! Try to hit the target 🎯",
        shame_text: "It's not rocket science, you’re good 🚀",

    },
    {
        // LEVEL 2
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 5),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT - (SCREEN_HEIGHT / 4), 10, SCREEN_HEIGHT / 965 * 200, {
            isStatic: true, 
            render: {
                sprite: {
                    texture: './img/target.png',
                    xScale: SCREEN_WIDTH / 1920 * 0.3,
                    yScale: SCREEN_HEIGHT / 965 * 0.4
                }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3, SCREEN_HEIGHT / 4, SCREEN_HEIGHT / 4, { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER }),
            Bodies.rectangle(SCREEN_WIDTH / 2, (SCREEN_HEIGHT / 3) + SCREEN_HEIGHT / 2.6, SCREEN_HEIGHT / 4, SCREEN_HEIGHT / 4, { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER })
        ],
        init_message: "Nice! Let's make it harder 💪",
        shame_text: "If cavemen did it, so can you 🦴",
    },
    {
        // LEVEL 3
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 5),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT - (SCREEN_HEIGHT / 4), 10, SCREEN_HEIGHT / 965 * 200, {
            isStatic: true, 
            render: {
                sprite: {
                    texture: './img/target.png',
                    xScale: SCREEN_WIDTH / 1920 * 0.3,
                    yScale: SCREEN_HEIGHT / 965 * 0.4
                }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH / 3, SCREEN_HEIGHT / 3, SCREEN_HEIGHT / 4, SCREEN_HEIGHT / 4, { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER }),
            Bodies.rectangle(SCREEN_WIDTH / 2.5, (SCREEN_HEIGHT / 3) + SCREEN_HEIGHT / 2.6, SCREEN_HEIGHT / 4, SCREEN_HEIGHT / 4, { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER })
        ],
        init_message: "Getting serious 🏅",
        shame_text: "Wanna give Sol a try? 🌞",
    },
    {
        // LEVEL 4
        knife: true,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 6.5),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 4),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT / 2, 10, SCREEN_HEIGHT / 965 * 250, {
            isStatic: true, 
            render: {
                sprite: {
                    texture: './img/target.png',
                    xScale: SCREEN_WIDTH / 1920 * 0.3,
                    yScale: SCREEN_HEIGHT / 965 * 0.5
                }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH - (SCREEN_HEIGHT / 1.3), SCREEN_HEIGHT - (SCREEN_HEIGHT / 3), SCREEN_HEIGHT / 1.3, SCREEN_HEIGHT / 4, { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER }),
            Bodies.rectangle(SCREEN_WIDTH - (SCREEN_HEIGHT / 1.3), SCREEN_HEIGHT - (SCREEN_HEIGHT / 3) - (SCREEN_HEIGHT / 2.5), SCREEN_HEIGHT / 1.3, SCREEN_HEIGHT / 4, { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER })
        ],
        init_message: "🥷 True Ninja 🥷",
        shame_text: "You’ve got 99 problems, but this ain’t one 🤘",

    },
    {
        // LEVEL 5
        knife: false,
        sling_x: SCREEN_WIDTH - (SCREEN_WIDTH / 7),
        sling_y: SCREEN_HEIGHT - (SCREEN_HEIGHT / 5),
        target: Bodies.rectangle(SCREEN_WIDTH - 100, SCREEN_HEIGHT / 2, 10, SCREEN_HEIGHT / 965 * 250, {
            isStatic: true, 
            render: {
                sprite: {
                    texture: './img/target.png',
                    xScale: SCREEN_WIDTH / 1920 * 0.3,
                    yScale: SCREEN_HEIGHT / 965 * 0.5
                }
        }
        }, ),
        obstacles: [
            Bodies.rectangle(SCREEN_WIDTH - (SCREEN_HEIGHT / 2), SCREEN_HEIGHT - (SCREEN_HEIGHT / 3), (SCREEN_HEIGHT / 2), (SCREEN_HEIGHT / 4), { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER }),
            Bodies.rectangle(SCREEN_WIDTH - (SCREEN_HEIGHT / 2), SCREEN_HEIGHT - (SCREEN_HEIGHT / 3) - (SCREEN_HEIGHT / 3.2), (SCREEN_HEIGHT / 2), (SCREEN_HEIGHT / 4), { isStatic: true, chamfer: { radius: 20 }, render: OBSTACLE_RENDER })
        ],
        init_message: "Wait a minute, Where's your weapon?"
    },
]

KNIFE_MASS = 15

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        wireframes: false,
        showAngleIndicator: false,
        background: 'transparent',
     }
})

Render.run(render)

var runner = Runner.create()
Runner.run(runner, engine)

var mouse = Mouse.create(render.canvas)

var afterUpdateListener

function level(level) {
    updateText(level.init_message)
    
    // Ground
    var ground = Bodies.rectangle((SCREEN_WIDTH) / 2, SCREEN_HEIGHT, SCREEN_WIDTH, 25, { isStatic: true })

    // Knife
    knifeOptions = {
        // density: 0.004,
        density: 0.5,
        render: {
            sprite: {
                texture: './img/knife.png',
                xScale: SCREEN_WIDTH / 1920 * 0.2,
                yScale: SCREEN_HEIGHT / 965 * 0.2
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
            visible: true,
            lineWidth: 1,
            strokeStyle: '#545454'
        },
        length: 2
    })

    World.add(engine.world, [ground, elastic, target, level.obstacles[0], level.obstacles[1]])
    if (level.knife) {
        World.add(engine.world, [knife])
    }


    if (afterUpdateListener) {
        Events.off(engine, 'afterUpdate', afterUpdateListener);
    }

    var knifeCounter = 0;
    afterUpdateListener = function() {

        if (mouseConstraint.mouse.button === -1 &&
            (knife.position.x > (SCREEN_WIDTH - level.sling_x) + 30 || knife.position.y < level.sling_y - 30)) {

            knife = Bodies.polygon(SCREEN_WIDTH - level.sling_x, level.sling_y, 8, KNIFE_MASS, knifeOptions)            

            if (level.knife) {
                World.add(engine.world, knife)
                knifeCounter++
            }
            elastic.bodyB = knife

        }
        if (knifeCounter == 3 && runner.enabled) {
            updateText(level.shame_text)
        }

        // Get the direction to the target
        const dx = anchor.x - knife.position.x
        const dy = anchor.y - knife.position.y

        // Calculate the angle using atan2
        const angle = Math.atan2(dy, dx);

        // Set the body's angle
        Body.setAngle(elastic.bodyB, angle);  
    }

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

    Events.on(engine, 'afterUpdate', afterUpdateListener)
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

    Composite.clear(world, false)

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

document.addEventListener("DOMContentLoaded", function() {
    nextLevel()
})