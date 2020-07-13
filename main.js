
/** 
 * kick
 * mono
 * drums.mp3
 * Band: 189
 * peak: ca 110-120
 * 
 * BassSyth
 * mono
 * bass.mp3
 * Band: 11
 * peak:160-170
 * Band: 9 
 * peak:190
 * 
 * HH
 * mono
 * other.mp3
 * Band: 
 * peak:
 * low:
 * 
 * Snair
 * mono
 * other.mp3
 * Band: 559
 * peak:70
 * low:60
 * 
 * MelodieSynth
 * mono
 * visual_distortion.mp3
 * Band: 
 * peak:
 * low:
 * 
 * 
 */

let bass 
let song
let ball_array = []
let segments = []
let last_segment = 0
let segments2 = []
let beatCount = 0
let drums

function preload(){
    bass  = loadSound('vsd/bass.mp3');
    song = loadSound('vsd/visual_distortion.mp3');
    drums = loadSound('vsd/drums.mp3');
}

let canvas;
let button;
let bass_fft;
let drums_fft

function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);
    canvas.mousePressed(pushSegment);
    bass.disconnect();
    drums.disconnect();
    // song.disconnect();

    bass_fft = new p5.FFT()
    bass_fft.setInput(bass);
    drums_fft = new p5.FFT()
    drums_fft.setInput(drums)
    


	theta = 0; 
}

function draw(){
    
 
  
  
  
  
  
    background(0);
    checkKick();
    

    

    segments = segments.filter(segment => segment.alive);
    segments.forEach((segment) => {
        segment.update();
        segment.show();
    });


    push()
        fill(255);
        textSize(45);
        text(beatCount, 120, 120);
        pop();
}

function getMillis(){
    let d = new Date();
    return d.getTime()
}
//kick
let lastKickval = 0;
let direction_kick = 1;

function checkKick(){
    let kick_spectrum = drums_fft.analyze();
    
    let kick_value = kick_spectrum[2];
   console.log(kick_value);
    if(lastKickval > kick_value){
        if(direction_kick > 0 && lastKickval > 190 &&getMillis()-last_segment > 450){
            last_segment = getMillis();
            let segment = new Segment(50, 50);
            beatCount ++
            segments.push(segment);
        }

        direction_kick = -1;
    }
    else{
        direction_kick = 1;
    }
    

    /*console.log(direction_kick);*/
    lastKickval = kick_value;
} 

let lastK






function toggleSong(){
    if(song.isPlaying()){
        song.pause();
        bass.pause();
        drums.pause();
    }else{
        song.play();
        bass.play();
        drums.play();
    }
}


class Ball{
    constructor(x, y, r = 20){
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 0.5;
        this.accel = 1.3;
    }

    show(){
        push();
        stroke(255);
        strokeWeight(3);
        fill(100);
        ellipse(this.x, this.y, this.r * 2);
        pop();
    }

    update(){
        this.y += this.speed;
        this.speed *= this.accel; 
    }
}

function pushSegment(){
    let segment = new Segment()
    segments.push(segment)
}





class Segment{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 30

        this.speed = 0.5;
        this.accel = 1.05;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        stroke('rgba(100,100,100,60)');
        strokeWeight(3);
        fill('rgba(195,171,222,100)');
        
        rect(width/2, height/2, this.size);
        pop();
    }

    update(){
        this.size += this.speed;
        this.speed *= this.accel; 
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
}

