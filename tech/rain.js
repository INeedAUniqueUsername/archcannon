let canvas = document.getElementById('canvasBack');
let ctx = canvas.getContext('2d');

window.requestAnimationFrame(update);

let wind = 0;
let rain = [];
let rainTrail = [];
let splash = [];
let lightposts = [];
let walkHeight;
for(let i = 0; i < 5; i++) {
    lightposts.push({
        //x: Math.floor(Math.random() * canvas.width / 16) * 16
        x: 128 + i * 256,
        rangeAverage: 3,
        range: 3 + Math.random()
    })
}
let lightning = {
    progress: 0,			//Number of segments that are visible
    segments: [],		//Number of segments in the whole structure
    brightness: 0,		//Brightness of the entire structure (if we are fully visible)
};

const fontSize = 24;
function update() {
    
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    
    //	Fill background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    
    ctx.font = `bold ${fontSize}px Inconsolata`;
    ctx.textAlign = "center";
    
    walkHeight = canvas.height - 60;
    if(lightning.brightness > 0) {
        //If not all the segments are visible, then make them fade in one by one
        if(lightning.progress < lightning.segments.length) {
            //Lightning takes exactly 1 / 15 second to fade in
            lightning.progress += lightning.segments.length / 2;
            
            //Draw the background flash
            ctx.fillStyle = "rgb(255, 255, 255, " + ((lightning.progress / lightning.segments.length) / 4) + ")";
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fill();
            
            //Draw the segments here
            for(let i = 0; i < lightning.progress; i++) {
                //Older segments are brighter
                let brightness = 1 - i / lightning.progress;
                ctx.fillStyle = "rgb(255, 255, 255, " + brightness + ")";
                let segment = lightning.segments[i];
                if(!segment) {
                    break;
                }
                ctx.fillText(segment.line, segment.x, segment.y);
            }
            
        } else {
            //Otherwise, we are fading out
            
            //Draw the background flash
            ctx.fillStyle = "rgb(255, 255, 255, " + (lightning.brightness * lightning.brightness / 2) + ")";
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fill();
            
            //Draw the lines
            ctx.fillStyle = "rgb(255, 255, 255, " + lightning.brightness + ")";
            lightning.brightness -= 0.05 + Math.random() * 0.05;
            lightning.segments.forEach(s => {
                ctx.fillText(s.line, s.x, s.y);
            });
        }
    } else if(Math.random() < 0.005) {
        lightning.segments = [];
        lightning.progress = 0;
        let sourcePoints = [{
            x: Math.random() * canvas.width,
            y: 0
        }];
        lightning.brightness = 1;
        for(let i = 0; i < sourcePoints.length; i++) {
            let p = sourcePoints[i];
            let x = p.x;
            for(let y = p.y; y < walkHeight; y += fontSize) {
            
                //We have a chance of shifting to the side
                let line = "|";
                if(Math.random() < 0.2) {
                    x -= fontSize;
                    line = "/";
                } else if(Math.random() < 0.2) {
                    x += fontSize;
                    line = "\"";
                }
                
                //We have a chance of forking
                if(Math.random() < 0.04) {
                    sourcePoints.push({
                        x:x,
                        y:y
                    });
                } else if(Math.random() < 0.04) {
                    //We also have a chance of ending this branch early
                    break;
                }
                
                lightning.segments.push({
                    x:x,
                    y:y,
                    line:line
                });
            }
        }
    }
    
    let banner = [
"+----                                                                             ----+",
"|                                                                                     |",
"| +---------------------------------------------------------------------------------+ |",
"| |                                                                                 | |",
"| | ======= ======  ======= =     = ======= ======= ==    = ==    =   ===   ==    = | |",
"|   =     = =     = =       =     = =       =     = = =   = = =   =  =   =  = =   =   |",
"|   ======= ======  =       ======= =       ======= =  =  = =  =  = =     = =  =  =   |",
"|   =     = =  ==   =       =     = =       =     = =   = = =   = =  =   =  =   = =   |",
"| | =     = =    == ======= =     = ======= =     = =    == =    ==   ===   =    == | |",
"| |                                                                                 | |",
"| +---------------------------------------------------------------------------------+ |",
"|                                                                                     |",
"+----                                                                             ----+",
];							
    //Update the brightness of the banner
    if(!update.bannerBrightness) {
        update.bannerBrightness = 1;
    } else {
        //Flicker chance
        if(Math.random() < 0.5) {
            //Flicker
            if(Math.random() < 0.6) {
                //Brightness down
                update.bannerBrightness -= Math.random() * update.bannerBrightness / (5 + Math.random() * 5);

                //Min brightness 0.2
                if(update.bannerBrightness < 0.2) {
                    update.bannerBrightness = 0.2;
                }
            } else {
                //Brightness up
                update.bannerBrightness += Math.random() * (1 - update.bannerBrightness) / (3 + Math.random() * 3);
            }
        }
    }

    //Draw the banner
    ctx.fillStyle = "rgb(255, 255, 255, " + update.bannerBrightness + ")";
    
    ctx.font = `bold ${36}px Inconsolata`;
    for(let i = 0; i < banner.length; i++) {
        ctx.fillText(banner[i], canvas.width/2, 36 + i*18);
    }

    
    //Sidewalk (ground)
    
    ctx.font = `bold ${fontSize}px Inconsolata`;
    ctx.fillStyle = "white";
    for(let x = 0; x < canvas.width; x += fontSize/2) {
        ctx.fillText("#", x, walkHeight + fontSize);
        
    }
    //Street
    ctx.fillStyle = "gray";
    for(let x = 0; x < canvas.width; x += fontSize/2) {
        for(let y = walkHeight + 48; y < canvas.height; y += fontSize) {
            ctx.fillText("=", x, y);
        }
    }
    let r = Math.random();
    if(r < 0.3) {
        //Wind has 30% chance of increasing speed
        wind += Math.sign(wind) * Math.random() * 1;
    } else if (Math.random() < 0.8) {
        //Wind has 50% chance of decreasing speed
        wind -= Math.sign(wind) * Math.random() * 1;
    } else {
        //Wind has 20% chance of changing randomly
        wind += 0.5 - Math.random() * 1;
    }
    //console.log("wind: " + wind);

    //Create up to 3 new rain drops
    for(let i = 0; i < Math.random() * 3; i++) {
        rain.push({
            x: Math.random() * canvas.width,
            y: -(Math.random() * 100 + 100),
            ySplash: canvas.height - Math.random() * 100,
            xSpeed: 0,
            ySpeed: Math.random() * 20 + 10
        });
    }

    //Update the rain
    rain.forEach(r => {
        r.x += r.xSpeed;
        r.y += r.ySpeed;
        r.ySpeed += 0.25;
        
        //Wind blows rain to the side
        if(Math.sign(wind) === Math.sign(r.xSpeed)) {
            //Stronger winds accelerate rain, but weaker winds do not slow down rain
            if(Math.abs(wind) > Math.abs(r.xSpeed)) {
                r.xSpeed += wind/30;
            }
        } else {
            //Wind in the opposite direction of rain accelerates it
            r.xSpeed += wind/30;
        }
        rainTrail.push({
            x: r.x,
            y: r.y,
            opacity: 1
        })
        ctx.fillText("1", r.x, r.y);
    });

    //When the rain hits the ground, add splash effect
    rain = rain.filter(r => {
        let remove = r.y > r.ySplash;
        if(remove) {
            r.ySpeed /= 6;
            splash.push(r);
            
        }
        return !remove;
    });

    //Update/Draw rain trail effects
    rainTrail = rainTrail.filter(t => {
        t.opacity -= 0.1;
        ctx.fillStyle = "rgba(204, 204, 255, " + t.opacity + ")";
        ctx.fillText("1", t.x, t.y);
        return t.opacity > 0;
    });
    //Draw splash effects
    splash.forEach(r => {
        r.y -= r.ySpeed;
        r.ySpeed -= 0.2;
        ctx.fillStyle = "rgba(204, 204, 255, " + r.ySpeed/3 + ")";
        ctx.fillText("0", r.x, r.y);
    });
    //Remove splash effects that are stationary
    splash = splash.filter(r => {
        let remove = r.ySpeed < 0.05;
        return !remove;
    });
    drawLights();
    window.requestAnimationFrame(update);
}

function drawLights() {
    let yDisplacement = 8;
    let segments = 6;
    let segmentHeight = 12;
    let lightHeight = walkHeight - segmentHeight * segments + yDisplacement - 6;
    /*
    //JavaScript is a joke because it doesn't have proper data structures
    if(typeof(drawLights.lightmap) != "undefined") {
        Object.keys(drawLights.lightmap).forEach(point => {
            
            let pair = point.split(" ");
            let x = parseInt(point[0]);
            let y = parseInt(point[1]);
            
            console.log(x + " " + y + " " + drawLights.lightmap[point]);
            
            
            ctx.beginPath();
            ctx.rect(x - 8, y - 8, 16, 16);
            ctx.fillStyle = "rgb(204, 204, 204, " + parseFloat(drawLights.lightmap[point]) + ")";
            ctx.fill();
        });
    } else {
        drawLights.lightmap = {};
        let lightSources = [];
        lightposts.forEach(l => {
            lightSources.push({
                x: l.x,
                y: lightHeight,
                range: 4
            });
        });
        lightSources.forEach(s => {
            let range = s.range;
            for(let xOffset = -range*2; xOffset < range*2; xOffset++) {
                for(let yOffset = -range*2; yOffset < range*2; yOffset++) {
                    let x = s.x + xOffset * 16;
                    let y = s.y + yOffset * 16;
                    let distance = Math.sqrt(xOffset*xOffset + yOffset*yOffset);
                    
                    if(distance == 0) {
                        continue;
                    }
                    let opacity = s.range / (distance * distance);
                    
                    let point = "" + x + " " + y;
                    drawLights.lightmap[point] = (drawLights.lightmap[point] || 0) + opacity;
                }
            }
        });
    }
    */
    let lightSources = [];
    lightposts.forEach(l => {
        if(Math.random() < 0.3) {
            //Chance of increasing or decreasing further from the average
            l.range += Math.sign(l.range - l.rangeAverage) * Math.random() / 10;
        } else if(Math.random() < 0.5) {
            l.range -= Math.sign(l.range - l.rangeAverage) * Math.random() / 10;
        }
        lightSources.push({
            x: l.x,
            y: lightHeight,
            range: l.range
        });
    });
    lightSources.forEach(s => {
        let maxRange = Math.floor(s.range) * 4;
        
        for(let xOffset = -maxRange; xOffset < maxRange; xOffset++) {
            for(let yOffset = -maxRange; yOffset < maxRange; yOffset++) {
                let x = s.x + xOffset * 16;
                let y = s.y + yOffset * 16;
                let distance = Math.sqrt(xOffset*xOffset + yOffset*yOffset);
                
                
                
                if(distance == 0) {
                    ctx.beginPath();
                    ctx.rect(x - 8, y - 8, 16, 16);
                    ctx.fillStyle = "rgb(204, 204, 204, 1)";
                    ctx.fill();
                    continue;
                }
                
                let opacity = s.range / (distance * distance);
                if(opacity < 0.05) {
                    continue;
                }
                
                
                ctx.beginPath();
                ctx.rect(x - 8, y - 8, 16, 16);
                ctx.fillStyle = "rgb(204, 204, 204, " + opacity + ")";
                ctx.fill();
            }
        }
    });
    lightposts.forEach(l => {
        ctx.font = `bold ${fontSize}px Inconsolata`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        for(let i = 0; i < segments; i++) {
            ctx.fillText("=", l.x, walkHeight - segmentHeight * i + yDisplacement);
            ctx.fillText("I", l.x, walkHeight - segmentHeight * i + yDisplacement);
        }
        ctx.fillText("Y", l.x, lightHeight + 6);
        ctx.fillText("---", l.x, lightHeight - 6);
        
        ctx.font = `bold ${fontSize + 8}px Inconsolata`;
        ctx.fillStyle = "yellow";
        ctx.fillText("*", l.x, lightHeight);
    });
}