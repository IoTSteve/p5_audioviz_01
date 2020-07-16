
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
let kicks = []
let swipes = []
let last_segment = 0
let last_kick = 0
let last_swipes = 0
let beatCount = 0
let drums
let swipe

function preload(){
    bass  = loadSound('vsd/bass.mp3');
    song = loadSound('vsd/visual_distortion.mp3');
    drums = loadSound('vsd/drums.mp3');
    swipe = loadSound('vsd/other.mp3')
}

let canvas;
let button;
let bass_fft;
let drums_fft;
let swipes_fft;


function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);
    canvas.mousePressed(pushSegment);
    bass.disconnect();
    drums.disconnect();
    //swipes.disconnect();
    // song.disconnect();

    bass_fft = new p5.FFT();
    bass_fft.setInput(bass);
    swipes_fft = new p5.FFT();
    swipes_fft.setInput(swipes);
    drums_fft = new p5.FFT();
    drums_fft.setInput(drums);


	theta = 0; 
}


function draw(){
    
 
  
  
  
  
  
    background(0);
    checkKick();
    checkBass();
    //checkSwipe();
    

    





    kicks = kicks.filter(kick => kick.alive);
    kicks.forEach((kick) => {
        kick.update();
        kick.show2();
        kick.show();
    });

    segments = segments.filter(segment => segment.alive);
    segments.forEach((segment) => {
        segment.update();
        segment.show();
    });

    swipes = swipes.filter(swipe => swipe.alive);
    swipes.forEach((swipes) => {
        swipe.update();
        swipe.show2();
        swipe.show();
        
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
        if(direction_kick > 0 && lastKickval > 190 &&getMillis()-last_kick > 450){
            last_kick = getMillis();
            let kick = new Kick(50, 50);
            beatCount ++
            kicks.push(kick);
        }

        direction_kick = -1;
    }
    else{
        direction_kick = 1;
    }
    

    /*console.log(direction_kick);*/
    lastKickval = kick_value;
} 

//swipe
let lastSwipeval = 0;
let direction_swipe = 1;

function checkSwipe(){
    let swipe_spectrum = swipe_fft.analyze();
    
    let swipe_value = swipe_spectrum[4];
   console.log(swipe_value);
    if(lastSwipeval > swipe_value){
        if(direction_swipe > 0 && lastSwipeval > 200 ){//&&getMillis()-last_segment > 450){
            //last_segment = getMillis();
            let swipe = new Swipe(50, 50);
            //beatCount ++
            swipes.push(swipe);
        }

        direction_swipe = -1;
    }
    else{
        direction_swipe = 1;
    }
    

    /*console.log(direction_kick);*/
    lastBassval = bass_value;
} 

let lastBassval = 0;
let direction_bass = 1;

function checkBass(){
    let bass_spectrum = bass_fft.analyze();
    
    let bass_value = bass_spectrum[3];
   console.log(bass_value);
    if(lastBassval > bass_value){
        if(direction_bass > 0 && lastBassval > 200 ){//&&getMillis()-last_segment > 450){
            //last_segment = getMillis();
            let segment = new Segment(50, 50);
            //beatCount ++
            segments.push(segment);
        }

        direction_bass = -1;
    }
    else{
        direction_bass = 1;
    }
    

    /*console.log(direction_kick);*/
    lastBassval = bass_value;
} 







function toggleSong(){
    if(song.isPlaying()){
        song.pause();
        bass.pause();
        drums.pause();
    }else{
        setTimeout(function(){ song.play(); }, 200);
        bass.play();
        drums.play();
    }
}

function pushSegment() {
    let segment = new Segment()
    segments.push(segment)
}

function pushKick() {
    let kick = new Kick()
    kicks.push(kick)
}

function pushSwipe() {
    let swipe = new Swipe()
    swipe.push(swipe)
}



class Segment{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 150

        this.speed = 1;
        this.accel = 1.05;

        this.stroke = 1;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        stroke('rgba(0,0,0,100)');
        strokeWeight(this.stroke);
        fill('rgba(85,85,85,100)');
        
        rect(width/2, height/2, this.size);
        pop();
    }

    update(){
        this.size += this.speed;
        this.speed *= this.accel; 
        this.stroke *= this.accel;
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
};

class Kick{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 160

        this.speed = 1;
        this.accel = 1.05;

        this.stroke = 1;
        //this.saturation = 20;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        stroke('rgba(0,0,0,100)');
        strokeWeight(this.stroke);
        //fill('rgba(85,85,85,100)');
        
        rect(width/2, height/2, this.size);
        pop();
    }

    show2(){
        push();
        rectMode(CENTER);
        fill('rgba(195,72,222,100)');

        rect(width/2, height/2, this.size+10);
        pop();
    }



    update(){
        this.size += this.speed;
        this.speed *= this.accel; 
        this.stroke *= this.accel;
        //this.saturation *= this.accel;
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
}

class Swipe{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 150

        this.speed = 1;
        this.accel = 1.05;

        this.stroke = 1.5;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        stroke('rgba(195,171,222,100)');
        strokeWeight(this.stroke);
        fill('rgba(85,85,85,100)');
        
        rect(width/2, height/2, this.size);
        pop();
    }

    update(){
        this.size += this.speed;
        this.speed *= this.accel; 
        this.stroke *= this.accel;
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
};

