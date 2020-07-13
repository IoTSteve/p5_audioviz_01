
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

let drums_l 
let song
let ball_array = []
let segments = []
let last_segment = 0
let segments2 = []

function preload(){
    drums_l  = loadSound('vsd/bass.mp3');
    //drums_2  = loadsound('vsd/bass.mp3');
    song = loadSound('vsd/visual_distortion.mp3');
}

let canvas;
let button;
let drums_l_fft;
//let drums_2_fft;

function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);
    canvas.mousePressed(pushSegment);
    drums_l.disconnect();
    // song.disconnect();

    drums_l_fft = new p5.FFT()
    drums_l_fft.setInput(drums_l);
    //drums_2_fft = new p5.FFT();
    //drums_2_fft.setInput(drums_2);


	theta = 0; 
}

function draw(){
    
  /*  let drums_l_spectrum = drums_l_fft.analyze();
    
    let basssynth_value = drums_l_spectrum[2];

    background(244,132,140); 

    // calculate the diameter of the circle 
    //height/2 + sin(theta) * amplitude; 
  
    var diam =  basssynth_value ;
  
    // draw the circle 
    ellipse(width/2,height/2, diam, diam); 
  
    // make theta keep getting bigger
    // you can play with this number to change the speed
 
  
    lastBassSynthval = basssynth_value;
  }
  */
  
  
  
  
  
    background(0);
    checkBassSynthpeak();
    //checkBassSynthlow();

    

    segments = segments.filter(segment => segment.alive);
    segments.forEach((segment) => {
        segment.update();
        segment.show();
    });

    /*segments2 = segments2.filter(segment => segment.alive);
    segments2.forEach((segment) => {
        segment.update();
        segment.show();
    });*/


   

    /*let killIDs = [];
    segments.forEach(function (segment, i){
        segment.update();
        if(segment.alive){
            segment.show();
        }else{
            killIDs.push(i);
        }
    })

    killIDs.forEach(function (id){
            segments.splice(id, 1);

    })

    let killIDs2 = [];
    segments2.forEach(function (segment2, i){
        segment2.update();
        if(segment2.alive){
            segment2.show();
        }else{
            killIDs2.push(i);
        }
    })

    killIDs2.forEach(function (id){
            segments2.splice(id, 1);

    })*/
}

/*function getMillis(){
    let d = new Date();
    return d.getTime()
}*/
//Bassynth
let lastBassSynthval = 0;
let direction_bs = 1;

function checkBassSynthpeak(){
    let drums_l_spectrum = drums_l_fft.analyze();
    
    let basssynth_value = drums_l_spectrum[11];
   console.log(basssynth_value);
    if(lastBassSynthval > basssynth_value){
        if(direction_bs > 0 && lastBassSynthval > 170 ){//&&getMillis()-last_segment > 450){
            //last_segment = getMillis();
            let segment = new Segment(50, 50);
            segments.push(segment);
        }

        direction_bs = -1;
    }
    else{
        direction_bs = 1;
    }
    

    /*console.log(direction_bs);*/
    lastBassSynthval = basssynth_value;
} 

let lastBassSynthval2 = 0;
let direction_bs2 = 1;

function checkBassSynthlow(){
    let drums_1_spectrum = drums_1_fft.analyze();
    
    let basssynth_value2 = drums_2_spectrum[9];
   // console.log(basssynth_value);
    if(lastBassSynthval2 > basssynth_value2){
        if(direction_bs2 > 0 && lastBassSynthval2 > 185){
            console.log("gfgh");
            let segment2 = new Segment2(50, 50);
            segments.push(segment2);
        }

        direction_bs2 = -1;
    }
    else{
        direction_bs2 = 1;
    }
    

   // console.log(direction_bs);
    lastBassSynthval2 = basssynth_value2;
} 



function toggleSong(){
    if(song.isPlaying()){
        song.pause();
        drums_l.pause();
    }else{
        song.play();
        drums_l.play();
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

function pushSegment2(){
    let segment2 = new Segment2()
    segments2.push(segment2)
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

class Segment2{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 30

        this.speed = 1;
        this.accel = 1.1;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        stroke(255);
        strokeWeight(1);
        fill('rgba(0,0,0,60)');
        rect(width/2, height/2, this.size);
        pop();
    }

    update(){
        this.size += this.speed;
        this.speed *= this.accel; 
        if(this.size > 1920 + 3000){
            this.alive = false;
        }
    }
}