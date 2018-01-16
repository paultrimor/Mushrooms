var canvas_width = screen.width; 
var canvas_height = 300; 
var ground_level = canvas_height - canvas_height/10; 

var fruits = []; 
var spores = []; 

function setup() {
	var canvas = createCanvas(canvas_width, canvas_height); 
	canvas.parent('canvas-wrapper'); 

	// initialize first mushroom 
	var first_fruit = new Fruit(canvas_width/2); 
	// Parameters for initalize(fruit_height, fruit_cap_width, friut_cap_height, fruit_bend) 
	first_fruit.initialize(100, 50, 30, 0); 
	fruits.push(first_fruit);

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
		spores[i].display();
		spores[i].update(); 

		if (spores[i].is_ready_to_fruit) {
			fruits.push(new Fruit(spores[i].x)); 
		}

		if (spores[i].is_dead) {
			// remove the spore to save memory 
		}
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
	this.cap_color =  color(random(50, 150), random(50, 150), random(0, 250)); 
	this.stem_color = color(255, random(100, 255), random(100, 220));
	this.fruit_cap_width = random(30,100);
	this.fruit_cap_height = random(20, 50); 

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

	// Structure variables (Spore)
	this.spore_position = createVector(0,0); 

	//Animation variables
	this.step = 0.001;
	this.pct = 0.0; 

}

Fruit.prototype.initialize = function (fruit_height, fruit_cap_width, fruit_cap_height, fruit_bend) {
	this.fruit_height = fruit_height; 
	this.fruit_cap_width = fruit_cap_width; 
	this.fruit_cap_height = fruit_cap_height; 
	this.fruit_bend = fruit_bend; 

}; 
Fruit.prototype.update = function() {
		this.pct += this.step; 

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
			this.cap_size_y = this.pct * this.fruit_cap_height + 5; 

			this.slope_x = (this.init_x + pow(this.pct, 1.5) * this.dist_x) - (this.init_x + pow(this.pct - this.step, 1.5) * this.dist_x); 
			this.slope_y = (this.init_y + pow(this.pct, 0.5) * this.dist_y) - (this.init_y + pow(this.pct - this.step, 0.5) * this.dist_y);
			
		}

		if (this.pct > 1.001 && this.pct < 1.005) {
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
	this.spore_position.set(parseFloat(random(-this.fruit_cap_width/2, this.fruit_cap_width/2)), 0); 
	this.spore_position.rotate(-atan(this.slope_x/this.slope_y)); 
	console.log("spore position: " + this.spore_position);
	return (new Spore(
		this.head_x + this.spore_position.x, 
		this.head_y + this.spore_position.y, 
		)
	);
}
/** END Fruit Object *****************************************************/

/** Spore Object *********************************************************/
function Spore(x, y){
	// Spore position variables
	this.x = x; 
	this.y = y; 

	// Animation variables 
	this.tx = 100*random(0,1); 
	this.ty = 300*random(0,1); 
	this.step = 0.001; 

	// State variables 
	this.health = 225; // Alpha color value
	this.death_rate = 0.0; 	
	this.on_ground = false; 
	this.is_dead = false; 
	this.is_ready_to_fruit = false; 

}

Spore.prototype.update = function(){

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
		this.x += map(noise(this.tx), 0, 1, -10, 10); 
		this.y += map(noise(this.ty), 0, 1, -1, 1.8);			
	}

	this.tx += this.step; 
	this.ty += this.step; 

	if (this.on_ground) {
		this.death_rate = 1; 
	}

	if (this.health == 50) {
		this.is_ready_to_fruit = true; 
	} else {
		this.is_ready_to_fruit = false; 
	}

	if (this.health < 0) {
		this.is_dead = true; 
	}

	this.health -= this.death_rate; 
}

Spore.prototype.display = function() {
	fill(color(255,100, 0, this.health)); 
	ellipse(this.x, this.y, 3, 3);
}



/** END Spore Object *****************************************************/
