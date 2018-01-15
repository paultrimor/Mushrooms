var canvas_width = screen.width; 
var canvas_height = 300; 

var fruits = []; 

function setup() {
	var canvas = createCanvas(canvas_width, canvas_height); 
	canvas.parent('canvas-wrapper'); 
	background(255, 204, 0);


	fruits.push(new Fruit (400)); 
	fruits.push(new Fruit (800)); 

}

function draw() {
	background(100, 255, 255);

	// Fruit Scan
	for (var i = 0; i < fruits.length; i++) {
		fruits[i].update(); 
		fruits[i].display(); 
	}

	// Spore Scan 
}

function mousePressed() {
	console.log('this workds');
	fruits.push(new Fruit(random(0, canvas_width)));
}




/** Fruit Object ********************************************************/
function Fruit(x) {

	// Dna variables
	this.fruit_height = 140; 
	this.fruit_color =  225; 
	this.fruit_cap_width = 90;
	this.friut_cap_height = 40; 

	// Position variables 
	this.init_x = x; 
	this.init_y = canvas_height - canvas_height/4; 
	this.final_x = this.init_x - 0;
	this.final_y = this.init_y - 100;
	this.head_x = 0;
	this.head_y = 0; 

	this.dist_x = this.final_x - this.init_x; 
	this.dist_y = this.final_y - this.init_y; 

	// State vairables 
	this.health = 1.0; 
	this.death_rate = 0; 
	this.is_ready = false; 
	this.is_dying = false;
	this.is_dead = false; 

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
				console.log(this.x_mid_point, this.mid_point_plus_radius_y);
			} else {
				this.mid_point_plus_radius_x = this.x_mid_point - (this.beizer_radius_x - this.beizer_radius);
				this.mid_point_plus_radius_y = this.y_mid_point - this.beizer_radius_y; 
			}

			// Mushroom Cap
			this.cap_size_x = pow(this.pct, 4) * this.fruit_cap_width;
			this.cap_size_y = this.pct * this.friut_cap_height; 

			this.slope_x = (this.init_x + pow(this.pct, 4) * this.dist_x) - (this.init_x + pow(this.pct - this.step, 4) * this.dist_x); 
			this.slope_y = (this.init_y + pow(this.pct, 0.5) * this.dist_y) - (this.init_y + pow(this.pct - this.step, 0.5) * this.dist_y);
			
		}
}

Fruit.prototype.display = function() {
		noStroke(0); 
		fill(100);	

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

		fill(255);
		push();
			translate(this.head_x, this.head_y);
			rotate(-atan(this.slope_x/this.slope_y)); 
			arc(0, 0, this.cap_size_x, this.cap_size_y, -PI, 0);  
		pop(); 

}

Fruit.prototype.spore = function() {

}
/** END Fruit Object *****************************************************/

/** Spore Object *********************************************************/
/** END Spore Object *****************************************************/
