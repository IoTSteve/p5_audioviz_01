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




function preload(){
  bass  = loadSound('vsd/bassloop.mp3');
  song = loadSound('vsd/visual_distortion.mp3');
  drums = loadSound('vsd/drums.mp3');
  swipe = loadSound('vsd/other.mp3')
}


function setup(){
    canvas = createCanvas(1920, 1080);
    canvas.mousePressed(pushObject);
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
    console.log(swipe_spectrum);
  let bass_value = bass_spectrum[3];
  
//  console.log(bass_value);
  if(lastBassval > bass_value){
      if(direction_bass > 0 && lastBassval > 200 ){//&&getMillis()-last_segment > 450){
          //last_segment = getMillis();
            if(swipe_spectrum[5]-5 < swipe_spectrum[2] || swipe_spectrum[5] < swipe_spectrum[7]){
                
            let segment = new Segment(50, 50);
            //beatCount ++
            musicObjects.push(segment);
            }else if(getMillis() - lastSwipe > 800){
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
  let d = new Date();
  return d.getTime()
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
    background(120, 80, 80);

   checkBass();
   checkKick();

    musicObjects = musicObjects.filter(object => object.alive);
    musicObjects.forEach((object) => {
        object.update();
        //kick.show2();
        object.show();
    });

        push()
        fill(255);
        textSize(45);
        text(beatCount, 120, 120);
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

        this.offset1 = 5;
        this.offset2 = 20;

        this.stroke = 1;
        //this.saturation = 20;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        noStroke()
        //stroke('rgba(0,0,0,100)');
        //strokeWeight(this.stroke);
        //fill('rgba(85,85,85,100)');
        fill('rgba(195,72,222,100)');
        rect(width/2, height/2, this.size);
        fill(0);
        rect(width/2, height/2, this.size-this.offset1);
        fill(80);
        rect(width/2, height/2, this.size-this.offset2);
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
        
        this.offset1 += this.speed/32 // 160/5  this.size/this.offset1  
        this.offset2 += this.speed/8  // 160/20  this.size/this.offset2

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
        this.size = 160

        this.speed = 1;
        this.accel = 1.05;

        this.offset1 = 20;

        this.stroke = 1.5;

        this.alive = true;
    }

    show(){
        push();
        rectMode(CENTER);
        noStroke();
        fill('rgba(195,171,222,100)');
        rect(width/2, height/2, this.size);
        fill(80);
        rect(width/2, height/2, this.size-this.offset1);
        pop();
    }

    update(){
        this.size += this.speed;

        this.offset1 += this.speed/8

        this.speed *= this.accel; 
        this.stroke *= this.accel;
        if(this.size > 1920 + 20000){
            this.alive = false;
        }
    }
};

