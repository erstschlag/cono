let commands = ["!erst", "!bequiet", "!hetzner"];

function typeWriter(text, element) {
    let index = 0;
    element.innerHTML = "";

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, randomInterval(200, 500));
        } else {
            setTimeout(untype, 10000); // Clear text after 10 seconds
        }
    }
    
    function untype() {
        if (element.innerHTML.length > 0) {
            element.innerHTML = element.innerHTML.substring(0,element.innerHTML.length -1);
            setTimeout(untype, 100);
        }
    }

    type();
}

function randomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

let index = 0;
function startTyping() {
    const container = document.getElementById('typewriter-container');
    if(index >= commands.length){
        index = 0;
    }
    typeWriter(commands[index], container);
    index++;
    // Set a random interval between 10 to 10 seconds for the next typing effect
    setTimeout(startTyping, randomInterval(20000, 30000));
}

$(() => {
    setTimeout(startTyping, randomInterval(1000, 5000));
});