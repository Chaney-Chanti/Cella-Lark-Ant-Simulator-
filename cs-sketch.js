// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference
// Time-stamp: <2020-02-02 15:58:23 Chuck Siska>

// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = { cell_size:10, wid:60, hgt:40 }; // JS Global var, w canvas size info.
var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 24; // Update ever 'mod' frames.
var g_stop = 0; // Go by default.

function setup() // P5 Setup Fcn
{
    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
    let height = sz * g_canvas.hgt;
    createCanvas( width, height );  // Make a P5 canvas.
    draw_grid( 10, 50, 'white', 'yellow' );
}

var g_bot = { nose:0, x:20, y:20, color:"FFFFFF", mode:"LRMode", counter:5}; // Dir is 0..7 clock, w 0 up.
var g_box = { t:1, hgt:47, l:1, wid:63 }; // Box in which bot can move.

function move_bot( )
{
    console.log("Move");
    let sz = g_canvas.cell_size;
    let sz2 = sz / 2;
    let x = 1+ g_bot.x*sz; // Set x one pixel inside the sz-by-sz cell.
    let y = 1+ g_bot.y*sz;
    let acolors = get( x + sz2, y + sz2 );
    let dx = 0;
    let dy = 0;

    // Changes nose direction
    if (g_bot.mode == "LRMode"){

      if (acolors == "0,0,0,0"){ //black turn left
        if(g_bot.nose == 0){ g_bot.nose = 3; }
        else{ g_bot.nose--; }
        }
      else if (acolors == "0,0,255,255"){ //blue turn left
        if(g_bot.nose == 0){ g_bot.nose = 3; }
        else{ g_bot.nose--; }
      }
      else if (acolors == "255,255,0,255"){ //yellow go straight (Goes into Set-count)
        // This is my implementation of Countdown mode but it's probably wrong. Need to clean up because redundant code.
        g_bot.mode = "SetCountMode";
      }
      else if (acolors == "255,0,0,255"){ //red turn right
        if(g_bot.nose == 3){ g_bot.nose = 0; }
        else{ g_bot.nose++; }
      }
       // Depending on nose direction, this will move the ant
      if(g_bot.nose == 0){
        dx = 1;
      }
      else if(g_bot.nose == 1){
        dy = 1;
      }
      else if(g_bot.nose == 2){
        dx = -1;
      }
      else if(g_bot.nose == 3){
        dy = -1;       
      }
    }

    if(g_bot.mode == "SetCountMode"){
      if(g_bot.counter > 0){
        if(g_bot.nose == 0){
          dx=1;
        }
        else if(g_bot.nose == 1){
          dy=1; 
        }
        else if(g_bot.nose == 2){
          dx=-1;         
        }
        else if(g_bot.nose == 3){
          dy=-1;
        }
        g_bot.counter--;
    } 
    if(g_bot.counter == 0) { //Resets counter and changes mode back to LRMode
      g_bot.counter = (round ( 5 * random()));
      g_bot.mode = "LRMode";
    }
}
  
    
    
    // Depending on nose direction, this will move the ant
    if(g_bot.nose == 0){
      dx = 1;
    }
    else if(g_bot.nose == 1){
      dy = 1;  
    }
    else if(g_bot.nose == 2){
      dx = -1;
    }
    else if(g_bot.nose == 3){
      dy = -1;
    }

    x = (dx + g_bot.x + g_box.wid) % g_box.wid; // Move-x.  Ensure positive b4 mod.
    y = (dy + g_bot.y + g_box.hgt) % g_box.hgt; // Ditto y.
    console.log("X: " + x);
    console.log("Y: " + y);
    g_bot.x = x; // Update bot x.
    g_bot.y = y;
    console.log("X: " + g_bot.x);
    console.log("Y: " + g_bot.y);
}

function draw_bot( ) // Convert bot pox to grid pos & draw bot.
{
    console.log("Draw bot");
    let sz = g_canvas.cell_size;
    let sz2 = sz / 2;
    let x = 1+ g_bot.x*sz; // Set x one pixel inside the sz-by-sz cell.
    let y = 1+ g_bot.y*sz;
    let big = sz -2; // Stay inside cell walls.

    let acolors = get( x + sz2, y + sz2 ); // Get cell interior pixel color [RGBA] array.
    if (acolors == "0,0,0,0"){ // if black fill blue
      fill( 0,0,255 ); 
      }
    else if (acolors == "0,0,255,255"){ //if blue fill yellow
      fill(255,255,0);
    }
    else if (acolors == "255,255,0,255"){ //if yellow fill red
      fill(255,0,0);
    }
    else if (acolors == "255,0,0,255"){ //if red fill black
      fill(0,0,0);
    }
    else{ //had to put this in because red would turn to white
      fill(0,0,255);
    }

    // Paint the cell.
    rect( x, y, big, big );
}

function draw_update()  // Update our display.
{
    move_bot( );
    draw_bot( );
}

function draw()  // P5 Frame Re-draw Fcn, Called for Every Frame.
{
    console.log("Draw");
    ++g_frame_cnt;
    if (0 == g_frame_cnt % g_frame_mod)
    {
        if (!g_stop) draw_update();
    }
}

function keyPressed( )
{
    g_stop = ! g_stop;
}

function mousePressed( )
{
    let x = mouseX;
    let y = mouseY;
    let sz = g_canvas.cell_size;
    let gridx = round( (x-0.5) / sz );
    let gridy = round( (y-0.5) / sz );
    g_bot.x = gridx + g_box.wid; // Ensure its positive.
    g_bot.x %= g_box.wid; // Wrap to fit box.
    g_bot.y = gridy + g_box.hgt;
    g_bot.y %= g_box.hgt;
    draw_bot( );
}
