let swipe_spectrum = []
let segments = [];
let kicks= [];
let swipes = [];
let musicObjects = []
let canvas
let counter = 0
let beatCount = 0
let last_kick = 0
let last_segment = 0
let drums, song, swipe, bass;
let drums_fft, song_fft, swipe_fft, bass_fft;
let startTime;
let flyballs = [];




function preload(){
  bass  = loadSound('vsd/bassloop.mp3');
  song = loadSound('vsd/visual_distortion.mp3');
  drums = loadSound('vsd/drums.mp3');
  swipe = loadSound('vsd/other.mp3')
}


function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);
    canvas.mousePressed(pushSwipe);
    bass.disconnect();
    drums.disconnect();
    //swipes.disconnect();
    // song.disconnect();

    
    /*buttonTime = createButton('get time');
    buttonTime.position(200, canvas.height + 10);
    buttonTime.mousePressed(printTime);*/
            document.onkeydown = function(event) {
                switch (event.keyCode) {
                   case 32 :
                       //printTime()
                       pushFlyball()
                }
            }
        
    
    

    bass_fft = new p5.FFT();
    bass_fft.setInput(bass);
    swipe_fft = new p5.FFT(0.8, 1024);
    swipe_fft.setInput(bass);
    drums_fft = new p5.FFT();
    drums_fft.setInput(drums);
    

}

let lastBassval = 0;
let direction_bass = 1;
let lastSwipe = 0

function checkBass(){
  let bass_spectrum = bass_fft.analyze();
  swipe_spectrum = swipe_fft.analyze();
    //console.log(swipe_spectrum);
  let bass_value = bass_spectrum[3];
  
//  console.log(bass_value);
  if(lastBassval > bass_value){
      if(direction_bass > 0 && lastBassval > 200 ){//&&getMillis()-last_segment > 450){
          //last_segment = getMillis();
            if(swipe_spectrum[5]-5 < swipe_spectrum[2] || swipe_spectrum[5] < swipe_spectrum[7]){
                
            let segment = new Segment(50, 50);
            //beatCount ++
            musicObjects.push(segment);

            if(beatCount > 29){
            let flyball = new Flyball(50, 50); //flyballs triggern am bass
            flyballs.push(flyball);
            }

            }else if(getMillis() - lastSwipe > 1800){
                let swipe = new Swipe(50, 50);
                musicObjects.push(swipe);
                lastObject = "swipe";
            lastSwipe = getMillis();
            }
      }

      direction_bass = -1;
  }
  else{
      direction_bass = 1;
  }
  

  /*console.log(direction_kick);*/
  lastBassval = bass_value;
} 



function getMillis(){
  return performance.now()
}
//kick
let lastKickval = 0;
let direction_kick = 1;

function checkKick(){
  let kick_spectrum = drums_fft.analyze();
  
  let kick_value = kick_spectrum[2];
 //console.log(kick_value);
  if(lastKickval > kick_value){
      if(direction_kick > 0 && lastKickval > 190 &&getMillis()-last_kick > 450){
          last_kick = getMillis();
          let kick = new Kick(50, 50);
          beatCount ++
         // if(beatCount < 25
          musicObjects.push(kick);
      }

      direction_kick = -1;
  }
  else{
      direction_kick = 1;
  }
  

  /*console.log(direction_kick);*/
  lastKickval = kick_value;
} 

function draw(){

    
    colorMode(HSB);
    background(240,50,20);

   checkBass();
   checkKick();

  

    musicObjects = musicObjects.filter(object => object.alive);
    musicObjects.forEach((object) => {
        object.update();
        //kick.show2();
        object.show();
    });


    flyballs = flyballs.filter(object => object.alive);
    flyballs.forEach((object) => {
        object.update();
        //kick.show2();
        object.show();
    });

        push()
        push()
        fill(255);
        textSize(45);
       // text(beatCount, 120, 120);
       // text("X wert: " + mouseX, 30, 40); 
       // text("Y wert: " + mouseY, 500, 40); 
        pop();
}

function pushObject(){
    counter++;
    switch (counter%3) {
        case 0:
            pushSegment();
            break;
        case 1:
            pushKick();
            break;
        case 2:
            pushSwipe();
            break;
        default:
            break;
    }
  }

  function toggleSong(){

    startTime = getMillis();
    if(song.isPlaying()){
        song.pause();
        bass.pause();
        drums.pause();
    }else{
        setTimeout(function(){ song.play(); }, 300);
        bass.play();
        drums.play();
    }
}

function getMillis() {
    return performance.now();
}

function pushSegment() {
    let segment = new Segment()
    musicObjects.push(segment)
}

function pushKick() {
    let kick = new Kick()
    musicObjects.push(kick)
}

function pushSwipe() {
    let swipe = new Swipe()
    musicObjects.push(swipe)
}

function pushFlyball(){
    let flyball = new Flyball()
    flyballs.push(flyball)
}



class Segment{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 150

        this.speed = 1;
        this.accel = 1.05;
        this.coloraccel = 1.02
        

        this.stroke = 1;
        this.saturation = 20;
        this.saturationMiddle = 100;
        this.coloraccel = 0.4;
        this.coloraccel2 = 0.98;

        this.offset1 = 5;
        this.offset2 = 20;
        

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        noStroke()
        colorMode(HSB);
        
        if (this.saturation  < 76) {
            fill(259,this.saturation,38);
        } else {
            fill(259,76,38);
        }
        //fill(259,this.saturation,38);
        rect(width/2, height/2, this.size);
        if (this.saturationMiddle  > 50) {
            fill(240,this.saturationMiddle,20);
        } else {
            fill(240,50,20);
        }
        //fill(240,50,20);
        rect(width/2, height/2, this.size-this.offset2);
        pop();
    }

    update(){
        this.size += this.speed;
        this.speed *= this.accel; 
        this.stroke *= this.accel;
        this.saturation += this.coloraccel;
        this.saturationMiddle *= this.coloraccel2;
        
        this.offset2 += this.speed/8
        
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
        this.saturation = 20;
        this.saturationMiddle = 100;
        this.coloraccel = 0.4;
        this.coloraccel2 = 0.98;

        this.offset1 = 5;
        this.offset2 = 20;
        

        this.stroke = 1;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        noStroke()
        colorMode(HSB);
        if (this.saturation  < 23) {
            fill(193,this.saturation,86);
        } else {
            fill(193,23,86);
        }
        //fill(193,this.saturation,86);
        rect(width/2, height/2, this.size);
        if (this.saturation  < 50) {
            fill(16,this.saturation,89);
        } else {
            fill(16,50,89);
        }
        //fill(16,this.saturation,89);
        rect(width/2, height/2, this.size-this.offset1);
        if (this.saturationMiddle  > 50) {
            fill(240,this.saturationMiddle,20);
        } else {
            fill(240,50,20);
        }
        //fill(240,50,20);
        rect(width/2, height/2, this.size-this.offset2);
        pop();
    }




    update(){
        this.size += this.speed;
        
        this.offset1 += this.speed/32 // 160/5  this.size/this.offset1  
        this.offset2 += this.speed/8  // 160/20  this.size/this.offset2

        this.speed *= this.accel; 
        this.stroke *= this.accel;
        
        this.saturation += this.coloraccel;
        this.saturationMiddle *= this.coloraccel2;
    
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
}


class Swipe{
    constructor(style){
        this.x = width/2;
        this.y = height/2;
        this.size = 160

        this.speed = 1;
        this.accel = 1.05;
        this.saturation = 20;
        this.saturationMiddle = 100;
        this.coloraccel = 0.4;
        this.coloraccel2 = 0.98;

        this.offset1 = 10;
        this.offset2 = 40;

        this.stroke = 1.5;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        noStroke();
        colorMode(HSB);
        if (this.saturation  < 23) {
            fill(193,this.saturation,86);
        } else {
            fill(193,23,86);
        }
        //fill(193,this.saturation,86);
        rect(width/2, height/2, this.size);
        
        if (this.saturation  < 34) {
            fill(225,this.saturation,67);
        } else {
            fill(225,34,67);
        }
        //fill(225,this.saturation,67);
        rect(width/2, height/2, this.size-this.offset1);
        if (this.saturationMiddle  > 50) {
            fill(240,this.saturationMiddle,20);
        } else {
            fill(240,50,20);
        }
        //fill(240,this.saturationMiddle,20);
        rect(width/2, height/2, this.size-this.offset2);
        pop();
    }

    update(){
        this.size += this.speed;

        this.offset1 += this.speed/16
        this.offset2 += this.speed/4 // 160/20  this.size/this.offset2

        this.speed *= this.accel; 
        this.stroke *= this.accel;
        this.saturation += this.coloraccel;
        this.saturationMiddle *= this.coloraccel2;
        
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
}

class Flyball{
    constructor(style){
        this.x = 1040;
        this.x2 = 880;
        this.size = 20

        this.speed = 1;
        this.accel = 1.05;
        this.ballaccel = 1.02;
        this.ballspeed = 1;
        

        
        this.saturation = 20;
        this.coloraccel = 0.4;
        this.coloraccel2 = 0.98;
        this.alive = true;
    }

    show(){
        push();
        ellipseMode(CENTER);
        noStroke()
        colorMode(HSB);
        
        if (this.saturation  < 50) {
            fill(56,this.saturation,89);
        } else {
            fill(56,50,89);
        }
        
        ellipse(this.x2, height/2, this.size);
       
    
    
        if (this.saturation  < 50) {
            fill(56,this.saturation,89);
        } else {
            fill(56,50 ,89);
        }
    
        ellipse(this.x, height/2, this.size);
        
        pop();
    }

    update(){
        this.x += this.speed;
        this.x2 -= this.speed;
        this.speed *= this.accel; 
        this.stroke *= this.accel;
        this.saturation += this.coloraccel;
        this.saturationMiddle *= this.coloraccel2;
        
    
        this.size += this.ballspeed
        this.ballspeed *= this.ballaccel

        
        this.offset2 += this.speed/8
        
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
};












function printTime() {
    console.log(performance.now() - startTime)
}
