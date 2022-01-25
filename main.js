
Element.prototype.create = function(obj) { 
    var element = document.createElement(obj);
    this.appendChild(element);
    return element;
}


let card_width = 600;
let card_height = 600;


$('s_x').max = card_width;
$('s_y').max = card_height;


let currentLabel = false;
let complete = [];
let layers = [];
let currentLayer = false;

let canvas = $("card");
canvas.style.width = card_width + 'px';
canvas.style.height = card_height + 'px';
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(card_width*scale);
canvas.height = Math.floor(card_height*scale);
canvas.style.border = '3px solid black';

let ctx = canvas.getContext('2d');

function $(id) {
    return document.getElementById(id)
}


function renderLayers() {
    let obj_layers = $('lay');
    obj_layers.innerHTML = '';
    for (let i = 0; i < layers.length; i++) {

        let div = obj_layers.create('div');
        div.innerHTML = layers[i].name;
        div.i = i;
        if (currentLayer === i)  { 
            div.className = 'slayer';
            $('s_scale').value = layers[i].size;
            $('s_x').value = layers[i].pos.y;
            $('s_y').value = layers[i].pos.y;
        }
        else { div.className = 'nslayer'} 

        div.onclick = function() {
            currentLayer = this.i;
            renderLayers();
        }

    }
}

setInterval(function() {
    ctx.fillStyle = ' white';
    ctx.fillRect(0,0,card_width,card_height);
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type == 'image') {
            let wid = layers[i].img.naturalWidth * (layers[i].size/100);
            ctx.drawImage(layers[i].img, layers[i].pos.x, layers[i].pos.y,wid,wid);
        }
        if (layers[i].type == 'text') {
            ctx.font = "30px Arial";
            ctx.fillStyle = 'black';
            ctx.fillText(layers[i].text, layers[i].pos.x, layers[i].pos.y);
        }
    }
},1000/60)

$('s_x').onchange = function() {
    if (currentLayer !== false) {
        layers[currentLayer].pos.x = this.value;
    }
}
$('s_y').onchange = function() {
    if (currentLayer !== false) {
        layers[currentLayer].pos.y = this.value;
    }
}
$('s_scale').onchange = function() {
    if (currentLayer !== false) {
        layers[currentLayer].size = this.value;
    }
}

function importText() {
    if (currentLabel !== false) {
        layers.unshift({
            name: complete[0][currentLabel],
            size: 100,
            pos: {
                x: 0,
                y: 0,
            },
            type: 'text',
            text: complete[1][currentLabel],
        })
        currentLayer = 0;
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }
}
function importImage() {
    if (currentLabel !== false) {
        
        var img = new Image();
        img.src = complete[1][currentLabel];

        layers.unshift({
            name: complete[0][currentLabel],
            size: 100,
            pos: {
                x: 0,
                y: 0,
            },
            type: 'image',
            img: img,
        })
        currentLayer = 0;
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }
}

importSheet(`Name,Race,State,Cards,Life,Attack,Agility,Gold ,XP,VP,Text,Template,Profile,Life icon,Agility icon,Attack icon,XP icon,Gold icon,VP Icon
Kobald,Imp,Living,1,4,3,1,2,3,2,These stout creatures can understand some human speak.  Unfortunately they are still too primal to reason with,R:/Rogue/Dungeons/Dungeon 1/Donjon 1 bis(1).png,R:/Rogue/Dungeons/Dungeon 1/Kobold.png,R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,R:/Rogue/Icons/Used/attak(1).png,R:/Rogue/Icons/Used/experience(1).png,R:/Rogue/Icons/Used/coins(1).png,R:/Rogue/Icons/Used/victory(1).png
Ooze,Slime,Undead,2,3,2,2,1,2,1,"Ooze are the failed attempts of a necromancer's reanimation.  Their minds are all but gone with only one impulse, consume everything around. ",R:/Rogue/Dungeons/Dungeon 1/Donjon 1 bis(1).png,R:/Rogue/Dungeons/Dungeon 1/Ooze,R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,R:/Rogue/Icons/Used/attak(1).png,R:/Rogue/Icons/Used/experience(1).png,R:/Rogue/Icons/Used/coins(1).png,R:/Rogue/Icons/Used/victory(1).png
Rat,Beast,Living,1,1,1,1,1,1,1,A small rat is scavenging the area.,R:/Rogue/Dungeons/Dungeon 1/Donjon 1 bis(1).png,R:/Rogue/Dungeons/Dungeon 1/Large Rat,R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,R:/Rogue/Icons/Used/attak(1).png,R:/Rogue/Icons/Used/experience(1).png,R:/Rogue/Icons/Used/coins(1).png,R:/Rogue/Icons/Used/victory(1).png
Will-O-Wisp,Sprite,Living,1,2,2,0,1,1,1,These puffs of magic are freed spites from fallen sorcerers,R:/Rogue/Dungeons/Dungeon 1/Donjon 1 bis(1).png,R:/Rogue/Dungeons/Dungeon 1/Wil-O-Wisp,R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,R:/Rogue/Icons/Used/Magic Attack Icon.png,R:/Rogue/Icons/Used/experience(1).png,R:/Rogue/Icons/Used/coins(1).png,R:/Rogue/Icons/Used/victory(1).png
Cavernous Spider,Arachnid,Living,1,2,2,1,1,3,1,"When a Cavernous Spider does damage to a character roll 1D20.  1-14, nothing happens.  15-20, place a poison token on the damaged character.",R:/Rogue/Dungeons/Dungeon 1/Donjon 1 bis(1).png,R:/Rogue/Dungeons/Dungeon 1/Cavernous Spider,R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,R:/Rogue/Icons/Used/attak(1).png,R:/Rogue/Icons/Used/experience(1).png,R:/Rogue/Icons/Used/coins(1).png,R:/Rogue/Icons/Used/victory(1).png
Flare (Boss),Elemental,Living,1,5,3,3,3,5,3,"Every time Flare moves he performs 1 attack on all figures, creatures and walls adjacent to his new location.  Defenders only roll defence and cannot cause damage while defending from this attack.  Flare is Immune to fire.",R:/Rogue/Dungeons/Dungeon 1/Donjon 1 bis(1).png,R:/Rogue/Dungeons/Dungeon 1/Fire Spirit(Boss),R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,R:/Rogue/Icons/Used/Magic Attack Icon.png,R:/Rogue/Icons/Used/experience(1).png,R:/Rogue/Icons/Used/coins(1).png,R:/Rogue/Icons/Used/victory(1).png
Healing Circle,,,3,,,,,,,"Though it is weak, you can feel a cleansing power resonating from this location.  Roll 4 attack dice and heal 1 life for every hit.","R:/Rogue/Dungeons/Dungeon 1/Donjon 1,2 bis(1).png",R:/Rogue/Dungeons/Dungeon 1/Level 1 Healing Circle.png,,,,,,
Cavern ,,,2,,,,,,,"Roll 1D20.  1-10, replace this card with the top card of the dungeon deck and encounter it as though you had attempted to capture it.  11-15, Draw a card from the random item deck.  16-20, encounter the top card on the stranger deck.","R:/Rogue/Dungeons/Dungeon 1/Donjon 1,2 bis(1).png",R:/Rogue/Dungeons/Dungeon 1/cavern.png,,,,,,
Wall,,,1,,,6,1,,,When attempting to capture a wall perform one attack.  If you succeed in causing damage you captured the wall. Each wall can only have one capture attempt per turn.,"R:/Rogue/Dungeons/Dungeon 1/Donjon 1,1 bis(1).png",R:/Rogue/Dungeons/Dungeon 1/Wall 1.png,R:/Rogue/Icons/Used/life(1).png,R:/Rogue/Icons/Used/agil_ity.png,,,,
Chest,,,2,,,,,,,"Roll 1D20 and add your agility to the roll.  1-10, failed to open, suffer a 5 damage trap and remove this card.  11-13, there is a bomb in the chest. 14-15, a level stone, roll 2D4 and get your level reward. 16+ draw the top card in the item deck.","R:/Rogue/Dungeons/Dungeon 1/Donjon 1,2 bis(1).png",R:/Rogue/Dungeons/Dungeon 1/Level 1 Chest.png,,,,,,`);
function importSheet(txt2) {
    let txt = txt2 ? txt2 : prompt('Paste Your Sheet:');
    let arr = txt.split('\n');
    complete = [];
    for (let i = 0; i < arr.length; i++) {
        complete.push(arr[i].split(','));
    }

    let labels = $('labels');
    for (let i = 0; i < complete[0].length; i++) {
        let btn = labels.create('button');
        btn.innerHTML = complete[0][i];
        btn.i = i;
        btn.id = 'i' + i;
        btn.onclick = function() {
            for (let k = 0; k < complete[0].length; k++) {
                $('i' + k).style.background = 'white';
            }
            currentLabel = this.i;
            this.style.background = 'gold';
        };
    }

}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


function moveLayer(pos) {
    if (currentLayer !== false && layers.length > 0) {
        if (pos == 'up' && currentLayer !== 0) {
            layers = array_move(layers,currentLayer,currentLayer - 1)
            currentLayer = currentLayer - 1; 
        }
        if (pos == 'down' && currentLayer !== layers.length - 1) {
            layers = array_move(layers,currentLayer,currentLayer + 1);
            currentLayer = currentLayer + 1;
        }
        renderLayers();
    }
}