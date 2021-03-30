// RULES (as I remember them):
// * On input of 'P', begin moving door
// * On a second input of 'P', before it's finished moving, pause it
//     * While paused, when 'P' input again, continue moving in the direction it was previously going
// * Once at the fully open position, inputting 'P' will begin closing, and it will follow the same rules on the way down
//
// * If input is an 'O', it immediately reverses direction
//
// * An '.' means no event has occurred
//
// * Always starts at closed position
//
// * Takes 5 iterations to move from fully one way to fully the other



// CODE:
const moveDoor = (position, direction, moving, output) => {
	if (!moving) {
		// if the door isn't moving, just add current position to the output
		return {
			position: position, 
			direction: direction, 
			moving: moving, 
			output: output += String(position)
		};
	} else if (((position == 5 && direction == 1) || (position == 0 && direction == -1)) && moving) {
		// if the door reached full open or closed via movement, change direction and stop movement
		return { 
			position: position, 
			direction: direction / -1, 
			moving: !moving, 
			output: output += String(position) 
		};
	} else {
		// if the door is just continuing on it's current path, just update it's position and output
		return { 
			position: position + direction, 
			direction: direction, 
			moving: moving, 
			output: output += String(position + direction) 
		};
	}
};

const handleInput = (input, position, direction, moving, output) => {
	if (input == 'P') {
		// button input: maintains the same direction, but alters its moving status
		return moveDoor(position, direction, !moving, output);
	} else if (input == 'O' && moving) {
		// hit something while moving: alters the direction, but maintains the moving status
		return moveDoor(position, direction / -1, moving, output);
	} else {
		// no input, or erroneous O input while not moving: does not alter direciton or moving status
		return moveDoor(position, direction, moving, output);
	}
};

const garageDoorFunction = commands => {
	let output = '';
	let position = 0; // 0 == fully closed, 5 == fully open
	let direction = 1; // 1 == opening, -1 == closing
	let moving = false;
	const inputs = [...commands];
	
	inputs.forEach(input => {
		({ position, direction, moving, output } = handleInput(input, position, direction, moving, output));
	});
	
	return output;
};



// PSEUDO-TESTS:

// Test normal door operation
console.log('test 1: ', garageDoorFunction('...P........P....') == '00012345555543210');
//                                          00012345555543210

// Test door handles pausing on the way up
console.log('test 2: ', garageDoorFunction('...P.P......P....') == '00012222222234555');
//                                          00012222222234555

// Test door handles pausing on the way down
console.log('test 3: ', garageDoorFunction('P.......P.P..P....') == '123455554333321000');
//                                          123455554333321000

// Test door handles hitting an object while opening, then opens the correct way
console.log('test 4: ', garageDoorFunction('...P.O......P....') == '00012100000012345');
//                                          00012100000012345

// Test door handles pausing after hitting an object
console.log('test 5: ', garageDoorFunction('...P...O.P.....P....') == '00012343222222210000');
//                                          00012343222222210000

// Test door still opens in the right direction when getting errors at full open or full closed position
console.log('test 6: ', garageDoorFunction('..O...P.......O...P.....') == '000000123455555555432100');
//                                          000000123455555555432100