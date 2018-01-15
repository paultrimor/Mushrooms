var canvas_width = screen.width; 
var canvas_height = 300; 
var ground_level = canvas_height - canvas_height/4; 

var fruits = []; 
var spores = []; 

function setup() {
	var canvas = createCanvas(canvas_width, canvas_height); 
	canvas.parent('canvas-wrapper'); 
	background(255, 204, 0);

}

function draw() {
	background(49, 27, 146);

	// Fruit Scan
	for (var i = 0; i < fruits.length; i++) {
		
		fruits[i].update(); 
		
		if (fruits[i].is_ready_to_spore) {
			spores.push(fruits[i].spore()); 
		}

		fruits[i].display(); 
	}

	// Spore Scan 
	for (var i = 0; i < spores.length; i++) {		
		spores[i].update(); 
		spores[i].display(); 
	}
}


function mousePressed() {
	fruits.push(new Fruit(random(0, canvas_width)));
}




/** Fruit Object ********************************************************/
function Fruit(x) {

	// Dna variables
	this.fruit_height = random(50, 180); 
	this.fruit_bend = random(-40, 40);
	this.cap_color =  color(random(100, 255), random(100, 150), random(100, 150)); 
	this.stem_color = color(255, random(100, 255), random(100, 220));
	this.fruit_cap_width = random(30,100);
	this.friut_cap_height = random(20, 50); 

	// Position variables 
	this.init_x = x; 
	this.init_y = ground_level; 
	this.final_x = this.init_x - this.fruit_bend;
	this.final_y = this.init_y - this.fruit_height;
	this.head_x = 0;
	this.head_y = 0; 

	this.dist_x = this.final_x - this.init_x; 
	this.dist_y = this.final_y - this.init_y; 

	// State vairables 
	this.is_ready_to_spore = false; 

	// Structure variables (Mushroom Stem) 
	this.beizer_radius = 20;  
	this.beizer_angle = null; 
	this.beizer_radius_x = null; 
	this.beizer_radius_y = null; 

	this.start_radius = 0; 
	this.end_radius = 10; 
	this.radius = this.start_radius; 

	this.x_mid_point = null; 
	this.y_mid_point = null;
	this.mid_point_plus_radius_x = null; 
	this.mid_point_plus_radius_y = null;

	// Structure variables (Mushroom Cap)
	this.cap_size_x = 10; 
	this.cap_size_y = 10; 

	this.slope_x = 0; 
	this.slope_y = 0;

	//Animation variables
	this.step = 0.001;
	this.pct = 0.0; 

}

Fruit.prototype.update = function() {
		this.pct += this.step; 
		console.log("pct: " + this.pct);
		if (this.pct < 1.0) {

			this.head_x = this.init_x + pow(this.pct, 4) * this.dist_x; 
			this.head_y = this.init_y + pow(this.pct, 0.50) * this.dist_y; 

			this.radius = this.pct * this.end_radius;

			// Mushroom Stem
			this.beizer_angle = acos((this.init_x-this.head_x)/(this.init_y-this.head_y)); 

			this.beizer_radius_x = this.beizer_radius * sin(this.beizer_angle); 
			this.beizer_radius_y = this.beizer_radius * cos(this.beizer_angle); 

			this.x_mid_point = this.init_x + (this.head_x - this.init_x)/2; 
			this.y_mid_point = this.init_y + (this.head_y - this.init_y)/2; 

			if (this.head_x > this.init_x) {
				this.mid_point_plus_radius_x = this.x_mid_point + (this.beizer_radius_x - this.beizer_radius);
				this.mid_point_plus_radius_y = this.y_mid_point + this.beizer_radius_y;
			} else {
				this.mid_point_plus_radius_x = this.x_mid_point - (this.beizer_radius_x - this.beizer_radius);
				this.mid_point_plus_radius_y = this.y_mid_point - this.beizer_radius_y; 
			}

			// Mushroom Cap
			this.cap_size_x = pow(this.pct, 4) * this.fruit_cap_width + 5;
			this.cap_size_y = this.pct * this.friut_cap_height + 5; 

			this.slope_x = (this.init_x + pow(this.pct, 1.5) * this.dist_x) - (this.init_x + pow(this.pct - this.step, 1.5) * this.dist_x); 
			this.slope_y = (this.init_y + pow(this.pct, 0.5) * this.dist_y) - (this.init_y + pow(this.pct - this.step, 0.5) * this.dist_y);
			
		}

		if (this.pct > 1.10 && this.pct < 1.102) {
			this.is_ready_to_spore = true; 
		} else {
			this.is_ready_to_spore = false;
		}

}

Fruit.prototype.display = function() {
		noStroke(0); 
		
		fill(this.stem_color);
		beginShape();
			curveVertex(this.init_x + this.radius/2, this.init_y);
			curveVertex(this.init_x + this.radius/2, this.init_y);
			curveVertex(this.mid_point_plus_radius_x + this.radius/2, this.mid_point_plus_radius_y + this.radius/2);
			curveVertex(this.head_x + (this.radius*0.5)/2, this.head_y);
			curveVertex(this.head_x + (this.radius*0.5)/2, this.head_y);
			curveVertex(this.head_x - (this.radius*0.5)/2, this.head_y);
			curveVertex(this.head_x - (this.radius*0.5)/2, this.head_y);
			curveVertex(this.mid_point_plus_radius_x - this.radius/2, this.mid_point_plus_radius_y + this.radius/2); 
			curveVertex(this.init_x - this.radius/2, this.init_y); 
			curveVertex(this.init_x - this.radius/2, this.init_y);
		endShape();

		fill(this.cap_color);
		push();
			translate(this.head_x, this.head_y);
			rotate(-atan(this.slope_x/this.slope_y)); 
			arc(0, 0, this.cap_size_x, this.cap_size_y, -PI, 0);  
		pop(); 

}

Fruit.prototype.spore = function() {
	return new Spore(10, 10);
}
/** END Fruit Object *****************************************************/

/** Spore Object *********************************************************/
function Spore(x, y){
	// Spore position variables
	this.x = x; 
	this.y = y; 

	// Animation variables 
	this.step = 0.1; 
	this.tx = random(0, 100); 
	this.ty = random(0, 300); 

	// State variables 
	this.health = 1.0; 
	this.death_rate = 0.0; 	
	this.on_ground = false; 
	this.is_dead = false; 
}

Spore.prototype.update = function(){
	console.log("spore.update()");

	if (this.y > ground_level ){
		this.on_ground = true; 
		this.is_dead = true; 
	} else {
		if (this.x < 0) {
			this.x = canvas_width;
		}
		if (this.x > canvas_width){
			this.x = 0; 
		}
		this.x = map(noise(this.tx), 0, 1, -3, 3); 
		this.y = map(noise(this.ty), 0, 1, -1, 2.5);			
	}

	this.tx += this.tick; 
	this.ty += this.tick; 

}

Spore.prototype.display = function() {
	fill(color(255,0,0)); 
	ellipse(this.x, this.y, 5, 5);
}



/** END Spore Object *****************************************************/
