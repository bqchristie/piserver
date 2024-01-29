const express = require('express')
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const app = express()
const port = 3000




app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.post('/gpio/blink', function(req, res) {
    try {

        var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
        var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms
        

        function blinkLED() { //function to start blinking
            if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
                LED.writeSync(1); //set pin state to 1 (turn LED on)
            } else {
                LED.writeSync(0); //set pin state to 0 (turn LED off)
            }
        }

        function endBlink() { //function to stop blinking
            clearInterval(blinkInterval); // Stop blink intervals
            LED.writeSync(0); // Turn LED off
            LED.unexport(); // Unexport GPIO to free resources
        }

        blinkLED(); //start blinking
        var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
        setTimeout(endBlink, 5000); //stop blinking after 5 seconds
        res.send({message: 'Blinking LED'});
    } catch (err) {
        res.send({message: 'Error blinking LED', error: err});
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
