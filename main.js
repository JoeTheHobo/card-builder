
Element.prototype.create = function(obj) { 
    var element = document.createElement(obj);
    this.appendChild(element);
    return element;
}


let card_width = 600;
let card_height = 600;

let copiedFormat = {
    scale: 100,
    x: 0,
    y: 0,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    wordWrap: false,
    fontSize: 20,
    fontColor: 'black',
    lineHeight: 20,
}

let changed = false;
let currentLabel = false;
let complete = [];
let layers = [];
let currentLayer = false;
let currentCreature = false;

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
            $('s_x').value = layers[i].pos.x;
            $('s_y').value = layers[i].pos.y;

            $('s_fontf').value = layers[i].fontF;
            $('s_fontc').value = layers[i].fontC;
            $('s_fontww').value = layers[i].fontWW;
            $('s_fontlh').value = layers[i].fontLH;
            $('s_fontst').value = layers[i].fontST;
            $('s_fonts').value = layers[i].fontS;
        }
        else { div.className = 'nslayer'} 

        div.onclick = function() {
            $('tableText').style.display = 'none';

            currentLayer = this.i;
            renderLayers();
            $('control').style.display = 'block';
            if (layers[currentLayer].type == 'text') $('tableText').style.display = 'block';
        }

    }
}

setInterval(function() {
    if (changed) {
        changed--;
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,card_width,card_height);
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].type == 'image') {
                
                var img = new Image();
                img.src = complete[currentCreature][layers[i].src];
                let wid = img.naturalWidth * (layers[i].size/100);
                ctx.drawImage(img, layers[i].pos.x, layers[i].pos.y,wid,wid);
            }
            if (layers[i].type == 'text') {
                ctx.font = layers[i].fontST + ' ' + layers[i].fontS + "px " + layers[i].fontF;
                ctx.fillStyle = layers[i].fontC;
                if (layers[i].fontWW !== false) {
                    let texts = getLines(ctx, complete[currentCreature][layers[i].text], layers[i].fontWW)
                    for (let k = 0; k < texts.length; k++) {
                        ctx.fillText(texts[k], layers[i].pos.x, Number(layers[i].pos.y) + Number(k*layers[i].fontLH));

                    }
                } else {
                    ctx.fillText(complete[currentCreature][layers[i].text], layers[i].pos.x, layers[i].pos.y);
                }
            }
        }
    }
},1000/60)

$('s_x').oninput = function() {
    if (currentLayer !== false) {
        layers[currentLayer].pos.x = this.value;
        changed = 10;
    }
}
$('s_y').oninput = function() {
    if (currentLayer !== false) {
        layers[currentLayer].pos.y = this.value;
        changed = 10;
    }
}
$('s_scale').oninput = function() {
    if (currentLayer !== false) {
        layers[currentLayer].size = this.value;
        changed = 10;
    }
}
$('s_fontf').oninput = function() {
    if (currentLayer !== false) {
        layers[currentLayer].fontF = this.value;
        changed = 10;
    }
}
$('s_fonts').oninput = function() {
    if (currentLayer !== false) {
        layers[currentLayer].fontS = this.value;
        changed = 10;
    }
}
$('s_fontc').oninput = function() {
    if (currentLayer !== false) {
        layers[currentLayer].fontC = this.value;
        changed = 10;
    }
}
$('s_fontst').oninput = function() {
    if (currentLayer !== false) {
        if (!this.value) this.value = 'normal';
        layers[currentLayer].fontST = this.value;
        changed = 10;
    }
}
$('s_fontww').oninput = function() {
    if (currentLayer !== false) {
        if (!this.value) this.value = 'false';
        layers[currentLayer].fontWW = this.value;
        changed = 10;
    }
}
$('s_fontlh').oninput = function() {
    if (currentLayer !== false) {
        if (!this.value) this.value = '15';
        layers[currentLayer].fontLH = this.value;
        changed = 10;
    }
}

function importText() {
    if (currentLabel !== false) {
        layers.push({
            name: complete[0][currentLabel],
            size: 100,
            pos: {
                x: 0,
                y: 0,
            },
            type: 'text',
            text: currentLabel,
            fontC: 'black',
            fontF: 'Arial',
            fontWW: false,
            fontST: 'normal',
            fontS: 20,
            fontLH: 15,
        })
        currentLayer = layers.length - 1;
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }
}
function importImage() {
    if (currentLabel !== false) {
        layers.push({
            name: complete[0][currentLabel],
            size: 100,
            pos: {
                x: 0,
                y: 0,
            },
            type: 'image',
            src: currentLabel,
        })
        currentLayer = layers.length - 1;
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }
}

importSheet(`Name	Race	State	Cards	Life	Attack	Agility	Gold 	XP	VP	Text	Template	Profile	Life icon	Agility icon	Attack icon	XP icon	Gold icon	VP Icon	Ability	Effect	Name2
Kobald	Imp	Living	1	4	3	1	2	3	2	These stout creatures can understand some human speak.  Unfortunately they are still too primal to reason with	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Kobold.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Ooze	Slime	Undead	2	3	2	2	1	2	1	Ooze are the failed attempts of a necromancer's reanimation.  Their minds are all but gone with only one impulse, consume everything around. 	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Ooze.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Rat	Beast	Living	1	1	1	1	1	1	1	A small rat is scavenging the area.	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Large Rat.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Will-O-Wisp	Sprite	Living	1	2	2	0	1	1	1	These puffs of magic are freed spites from fallen sorcerers	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Wil-O-Wisp.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/Magic Attack Icon.png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Cavernous Spider	Arachnid	Living	1	2	2	1	1	3	1		R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Cavernous Spider.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png	When a Cavernous Spider does damage to a character roll 1D20. 1-14, nothing happens. 15-20, place a poison token on the damaged character.		
Flare (Boss)	Elemental	Living	1	5	3	3	3	5	3		R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Fire Spirit(Boss).png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/Magic Attack Icon.png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png	Every time Flare moves he performs 1 attack on all figures, creatures and walls adjacent to his new location. Defenders only roll defence and cannot cause damage while defending from this attack. Flare is Immune to fire.		
			3								R:/Rogue/Dungeons/Dungeon 1/template3.png	R:/Rogue/Dungeons/Dungeon 1/Level 1 Healing Circle.png								Though it is weak, you can feel a cleansing power resonating from this location. Roll 4 attack dice and heal 1 life for every hit.	Healing Circle
			2								R:/Rogue/Dungeons/Dungeon 1/template3.png	R:/Rogue/Dungeons/Dungeon 1/cavern.png								Roll 1D20. 1-10, replace this card with the top card of the dungeon deck and encounter it as though you had attempted to capture it. 11-15, Draw a card from the random item deck. 16-20, encounter the top card on the stranger deck.	Cavern 
			1	1		6					R:/Rogue/Dungeons/Dungeon 1/template2.png	R:/Rogue/Dungeons/Dungeon 1/Wall 1.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png						When attempting to capture a wall perform one attack. If you succeed in causing damage you captured the wall. Each wall can only have one capture attempt per turn.	Wall
			2								R:/Rogue/Dungeons/Dungeon 1/template3.png	R:/Rogue/Dungeons/Dungeon 1/Level 1 Chest.png								Roll 1D20 and add your agility to the roll. 1-10, failed to open, suffer a 5 damage trap and remove this card. 11-13, there is a bomb in the chest. 14-15, a level stone, roll 2D4 and get your level reward. 16+ draw the top card in the item deck.	Chest`);
function importSheet(txt2) {
    let txt = txt2 ? txt2 : prompt('Paste Your Sheet:');
    let arr = txt.split('\n');
    currentCreature = 1;
    complete = [];
    for (let i = 0; i < arr.length; i++) {
        complete.push(arr[i].split('	'));
    }

    let labels = $('labels');
    labels.innerHTML = '';
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
    let swtch = $('switch');
    swtch.innerHTML = '';
    for (let i = 1; i < complete.length; i++) {
        let btn = swtch.create('button');
        btn.innerHTML = complete[i][0];
        btn.i = i;
        btn.onclick = function() {
            currentCreature = this.i;
            changed = 10;
        }
    }
    changed = 10;
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

function deleteLayer() {
    layers.splice(currentLayer, 1);

    currentLayer--;
    if (currentLayer < 0) currentLayer = 0;

    renderLayers();
}
function save() {
    download('Saved Layers File',JSON.stringify(layers));
}
paste(`[{"name":"Profile","size":"190","pos":{"x":"60","y":"50"},"type":"image","src":12},{"name":"Template","size":"76","pos":{"x":0,"y":0},"type":"image","src":11},{"name":"Attack icon","size":"30","pos":{"x":"0465","y":"225"},"type":"image","src":15},{"name":"Life icon","size":"30","pos":{"x":"465","y":"40"},"type":"image","src":13},{"name":"Agility icon","size":"25","pos":{"x":"470","y":"130"},"type":"image","src":14},{"name":"XP icon","size":"30","pos":{"x":"465","y":"310"},"type":"image","src":16},{"name":"Gold icon","size":"30","pos":{"x":"465","y":"395"},"type":"image","src":17},{"name":"VP Icon","size":"30","pos":{"x":"465","y":"490"},"type":"image","src":18},{"name":"Life","size":100,"pos":{"x":"520","y":"105"},"type":"text","text":4,"fontC":"black","fontF":"Arial","fontS":"30","fontLH":"20","fontWW":"false","fontST":"italic"},{"name":"Agility","size":100,"pos":{"x":"522","y":"195"},"type":"text","text":6,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Attack","size":100,"pos":{"x":"522","y":"288"},"type":"text","text":5,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"XP","size":100,"pos":{"x":"522","y":"378"},"type":"text","text":8,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Gold ","size":100,"pos":{"x":"522","y":"467"},"type":"text","text":7,"fontC":"black","fontF":"arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"VP","size":100,"pos":{"x":"522","y":"558"},"type":"text","text":9,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Name","size":100,"pos":{"x":"45","y":"450"},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"23","fontLH":15},{"name":"Race","size":100,"pos":{"x":"260","y":"452"},"type":"text","text":1,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"22","fontLH":15},{"name":"State","size":100,"pos":{"x":"360","y":"452"},"type":"text","text":2,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"22","fontLH":15},{"name":"Text","size":100,"pos":{"x":"35","y":"475"},"type":"text","text":10,"fontC":"black","fontF":"Arial","fontWW":"350","fontST":"italic","fontS":"17","fontLH":"20"},{"name":"Ability","size":100,"pos":{"x":"35","y":"475"},"type":"text","text":19,"fontC":"black","fontF":"Arial","fontWW":"365","fontST":"normal","fontS":"17","fontLH":"20"},{"name":"Effect","size":100,"pos":{"x":"35","y":"455"},"type":"text","text":20,"fontC":"black","fontF":"Arial","fontWW":"520","fontST":"normal","fontS":20,"fontLH":"20"},{"name":"Name2","size":100,"pos":{"x":"50","y":"425"},"type":"text","text":21,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"23","fontLH":15}]`)
function paste(strs) {
    let str = strs ? strs : prompt('Paste Your Layer String Below:');
    layers = JSON.parse(str)
    renderLayers();
}
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function copyFormat() {
    copiedFormat = {
        scale: $('s_scale').value,
        x: $('s_x').value,
        y: $('s_y').value,
        fontFamily: $('s_fontf').value,
        fontStyle: $('s_fontst').value,
        wordWrap: $('s_fontww').value,
        fontSize: $('s_fonts').value,
        fontColor: $('s_fontc').value,
        lineHeight: $('s_fontlh').value,
    }
}
function pasteFormat() {
    if (currentLayer !== false) {
        layers[currentLayer].scale = copiedFormat.scale;
        layers[currentLayer].pos.x = copiedFormat.x;
        layers[currentLayer].pos.y = copiedFormat.y;
        layers[currentLayer].fontF = copiedFormat.fontFamily;
        layers[currentLayer].fontST = copiedFormat.fontStyle;
        layers[currentLayer].fontWW = copiedFormat.wordWrap;
        layers[currentLayer].fontS = copiedFormat.fontSize;
        layers[currentLayer].fontC = copiedFormat.fontColor;
        layers[currentLayer].fontLH = copiedFormat.lineHeight;
        renderLayers();
    }
}



let fcanvas = $('final');
fcanvas.style.width = card_width * 10;
fcanvas.style.height = card_height * 7;
fcanvas.width = Math.floor(card_width*10*scale);
fcanvas.height = Math.floor(card_height*7*scale);
fctx = fcanvas.getContext('2d');

function importLayout() {
    fcanvas.style.display = 'block';
    let sum = [];
    for (let i = 1; i < complete.length; i++) {
        sum.push(Number(complete[i][currentLabel]));
    }
    let cards = 0;

    let i = -1;
    let loop = setInterval(function() {
        i++;
        if (i >= sum.length) {
            clearInterval(loop);
        } else {
            currentCreature = i + 1;
            changed = 10;
            setTimeout(function() {
                for (let j = 0; j < sum[i]; j++) {
                    cards++;
                    fctx.drawImage(ctx.canvas, (((cards-1) % 10)) * 600, (600 * ((Math.ceil(cards/10))-1)));
                }
            },50)
        }
    },100)
}


let keysDown = {
    s: false,
}
document.body.onkeydown = function(e) {
    switch(e.key) {
        case 's':
            keysDown.s = true;
            break;
    }
}
document.body.onkeyup = function(e) {
    switch(e.key) {
        case 's':
            keysDown.s = false;
            break;
    }
}

document.body.addEventListener('wheel', function(e) {
    if (e.deltaY > 0) {
        if (keysDown.s && currentLayer !== false) {
            layers[currentLayer].size = Number(layers[currentLayer].size) - Number($('s_scroll').value);
            renderLayers();
            changed = 10;
        }
    } else {
        if (keysDown.s && currentLayer !== false) {
            layers[currentLayer].size = Number(layers[currentLayer].size) + Number($('s_scroll').value);
            renderLayers();
            changed = 10;
        }
    }

    

});