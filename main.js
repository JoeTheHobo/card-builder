/*
====BUGS====



============


*/



///////////////
//  Library  //
///////////////
{
    Element.prototype.create = function(obj) { 
        var element = document.createElement(obj);
        this.appendChild(element);
        return element;
    }
    function $(id) {
        return document.getElementById(id)
    }
}
///////////////////
//  Library End  //
///////////////////

let copiedFormat = {
    scale: 100,
    x: 0,
    y: 0,
    fontFamily: 'Arial',
    wordWrap: false,
    fontSize: 20,
    fontColor: 'black',
    lineHeight: 20,
    textAlign: false,
    fontI: false,
    fontB: false,
}

let changed = false;
let currentLabel = false;
let complete = [];
let layers = [];
let currentLayer = false;
let currentCreature = false;
let card_width = false;
let card_height = false;
let canvas = $("card");
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.style.border = '3px solid black';
let ctx = canvas.getContext('2d');
runCanvasSizing();
function runCanvasSizing() {
    card_width = Number($('canvas_width').value);
    card_height = Number($('canvas_height').value);
    card_scale = Number($('canvas_scale').value);
    canvas.style.width = (card_width * (card_scale / 100)) + 'px';
    canvas.style.height = (card_height * (card_scale / 100)) + 'px';
    canvas.width = Math.floor(card_width*scale);
    canvas.height = Math.floor(card_height*scale);
    drawCard();
}

let currentNumberVersion = false;
function switchCustomNumber(num) {
    let checked = document.querySelectorAll('#bottomRowSettings')[num*2-2].checked;
    for (let i = 0; i < 5; i++) {
        document.querySelectorAll('#bottomRowSettings')[i*2].checked = false;
    }
    document.querySelectorAll('#bottomRowSettings')[num*2-2].checked = checked;
    currentNumberVersion = checked ? num : false;
    if (checked == true) {
        renderLayers(num);
    } else {
        renderLayers();
    }
}
function uncheckallSwitch() {
    currentNumberVersion = false;
    for (let i = 0; i < 5; i++) {
        document.querySelectorAll('#bottomRowSettings')[i*2].checked = false;
    }
}


function renderLayers(num = currentNumberVersion) {
    let obj_layers = $('lay');
    //Clear All Current Layers In HTML
    obj_layers.innerHTML = '';
    //Creating New Layers For Each Layer
    for (let i = 0; i < layers.length; i++) {
        //Creating A New Layer (Left menu layer items)
        let div = obj_layers.create('div');
        div.innerHTML = layers[i].name;
        div.i = i;
        if (layers[i].type == 'image') div.id='nimage';
        if (layers[i].type == 'text') div.id='ntext';
        div.className = 'nlayer';
        if (currentLayer === i)  {
            div.id = 'ngold';
            /*
            let c = i;
            let l = layers[c];
            //If There Is A Selected Set
            if (num !== false) {
                //If Said Selected Set Is Empty, Then Create A Copy Of Current Layer To Set
                if (Object.keys(layers[c].sets[num-1]).length === 0) {
                    layers[c].sets[num-1] = JSON.parse(JSON.stringify( layers[c] ));
                }
                l = layers[c].sets[num-1];
            }

            $('s_scale').value = l.size;
            $('s_x').value = l.pos.x;
            $('s_y').value = l.pos.y;
            
            if (layers[c].type == 'image') {
                if (!isNaN(l.src)) $('s_src').value = complete[currentCreature][l.src];
                else $('s_src').value = l.src;
            }
            if (layers[c].type == 'text') {
                $('s_fontf').value = l.fontF;
                $('s_fontc').value = l.fontC;
                $('s_fontww').value = l.fontWW;
                $('s_fontlh').value = l.fontLH;
                $('s_fonts').value = l.fontS;
                $('s_fontta').checked = l.fontTA;
                $('s_fonti').checked = l.fontI;
                $('s_fontb').checked = l.fontB;
            }
            */


            //if No Sets Are Selected
            if (num === false) {
                $('s_scale').value = layers[i].size;
                $('s_x').value = layers[i].pos.x;
                $('s_y').value = layers[i].pos.y;
                
                if (layers[currentLayer].type == 'image') {
                    if (!isNaN(layers[i].src)) $('s_src').value = complete[currentCreature][layers[i].src];
                    else $('s_src').value = layers[i].src;
                }
                if (layers[currentLayer].type == 'text') {
                    $('s_fontf').value = layers[i].fontF;
                    $('s_fontc').value = layers[i].fontC;
                    $('s_fontww').value = layers[i].fontWW;
                    $('s_fontlh').value = layers[i].fontLH;
                    $('s_fonts').value = layers[i].fontS;
                    $('s_fontta').checked = layers[i].fontTA;
                    $('s_fonti').checked = layers[i].fontI;
                    $('s_fontb').checked = layers[i].fontB;
                }
            } else {
                //Key A
                //If Current Selected Set Is Empty (Should be able to delete later)
                if (Object.keys(layers[currentLayer].sets[num-1]).length === 0) {
                    console.log('ey')
                    //Create A Clone of Current Settings for Set
                    layers[currentLayer].sets[num-1] = JSON.parse(JSON.stringify( layers[currentLayer] ));
                    $('s_scale').value = layers[i].size;
                    $('s_x').value = layers[i].pos.x;
                    $('s_y').value = layers[i].pos.y;

                    if (layers[currentLayer].type == 'image') {
                        if (!isNaN(layers[i].src)) $('s_src').value = complete[currentCreature][layers[i].src];
                        else $('s_src').value = layers[i].src;
                    }
                    if (layers[currentLayer].type == 'text') {
                        $('s_fontf').value = layers[i].fontF;
                        $('s_fontc').value = layers[i].fontC;
                        $('s_fontww').value = layers[i].fontWW;
                        $('s_fontlh').value = layers[i].fontLH;
                        $('s_fonts').value = layers[i].fontS;
                        $('s_fontta').checked = layers[i].fontTA;
                        $('s_fonti').checked = layers[i].fontI;
                        $('s_fontb').checked = layers[i].fontB;
                    }
                } else {
                    //i == currentlayer
                    $('s_scale').value = layers[i].sets[num-1].size;
                    $('s_x').value = layers[i].sets[num-1].pos.x;
                    $('s_y').value = layers[i].sets[num-1].pos.y;
                    
                    if (layers[currentLayer].type == 'image') {
                        if (!isNaN(layers[i].sets[num-1].src)) $('s_src').value = complete[currentCreature][layers[i].sets[num-1].src];
                        else $('s_src').value = layers[i].sets[num-1].src;
                    }
                    if (layers[currentLayer].type == 'text') {
                        $('s_fontf').value = layers[i].sets[num-1].fontF;
                        $('s_fontc').value = layers[i].sets[num-1].fontC;
                        $('s_fontww').value = layers[i].sets[num-1].fontWW;
                        $('s_fontlh').value = layers[i].sets[num-1].fontLH;
                        $('s_fonts').value = layers[i].sets[num-1].fontS;
                        $('s_fontta').checked = layers[i].sets[num-1].fontTA;
                        $('s_fonti').checked = layers[i].sets[num-1].fontI;
                        $('s_fontb').checked = layers[i].sets[num-1].fontB;
                    }
                }
            }
            
        }

        div.onclick = function() {
            uncheckallSwitch();
            $('tableText').style.display = 'none';
            $('tableImage').style.display = 'none';
            $('showOnLayer').style.display = 'none';
            if (currentLayer === this.i) {
                currentLayer = false;
                $('controlSettings').style.display = 'none';
            } else {
                currentLayer = this.i;
                $('controlSettings').style.display = 'block';
                if (layers[currentLayer].type == 'text') $('tableText').style.display = 'block';
                if (layers[currentLayer].type == 'image') $('tableImage').style.display = 'block';
                $('showOnLayer').style.display = 'block';
            }
            renderLayers();
        }

    }
    drawCard();
}

let allImages = [];
function applyLayer(i,end,anychecked) {
    let use = layers[i];
    if (anychecked) use = layers[i].sets[anychecked-1];

    if (Object.keys(use).length === 0) {
        layers[i].sets[anychecked - 1] = JSON.parse(JSON.stringify( layers[i] ));
        use = layers[i].sets[anychecked-1];
    }

    if (layers[i].type == 'image') {
        let fimg = false;
        for (let k = 0; k < allImages.length; k++) {
            if (allImages[k].layer == i && allImages[k].switch == currentCreature) {
                fimg = allImages[k].htmlImg;
            }
        }
        if (!fimg) {
            var img = new Image();
            let htmlImg = $('allImages').create('img');
            if (!isNaN(use.src)) htmlImg.src = complete[currentCreature][use.src];
            else htmlImg.src = use.src;
            img.onload = function() {
                allImages.push({
                    img: this,
                    layer: i,
                    htmlImg: htmlImg,
                    switch: currentCreature,
                })

                let wid = img.naturalWidth * (use.size/100);
                let hie = img.naturalHeight * (use.size/100)
                ctx.drawImage(img, use.pos.x, use.pos.y,wid,hie);
                if (i < end) applyLayer(i + 1,end,anychecked);
            }
            if (!isNaN(use.src)) img.src = complete[currentCreature][use.src];
            else img.src = use.src;

            fimg = img;
        } else {
            let wid = fimg.naturalWidth * (use.size/100);
            let hie = fimg.naturalHeight * (use.size/100)
            ctx.drawImage(fimg, use.pos.x, use.pos.y,wid,hie);
            if (i < end) applyLayer(i + 1,end,anychecked);
        }
    }
    if (layers[i].type == 'text') {
        //Creating Context Font
        let cfont = '';
        if (use.fontI) cfont += ' italic';
        if (use.fontB) cfont += ' bold';
        ctx.font = cfont + ' ' + (use.fontS * (use.size/100)) + "px " + use.fontF;
        //Finish

        ctx.fillStyle = use.fontC;
        if (use.fontTA) ctx.textAlign = 'center';
        else ctx.textAlign = 'left';
        let use_fontLH = use.fontLH == '' ? 15 : use.fontLH;
        if (use.fontWW !== false && use.fontWW !== '') {
            //Set layeredText Variable to be an array of all text and text line breaks;
            let layeredText = [complete[currentCreature][use.text]];
            if (complete[currentCreature][use.text].includes('**')) {
                layeredText = complete[currentCreature][use.text].split('**');
            }
            //Repeat for every line break fround in text
            let lineHcount = 0;
            for (let h = 0; h < layeredText.length; h++) {
                //Seperate [current paragraph] into an array depending on where line breaks [use.fontWW] are found;
                let texts = getLines(ctx, layeredText[h], use.fontWW)
                //Repeat for every line break in 'texts' [current paragraph];
                for (let k = 0; k < texts.length; k++) {
                    ctx.fillText(texts[k], use.pos.x, Number(use.pos.y) + (lineHcount*use_fontLH) + Number(k*use_fontLH));
                }
                //Increase Height Between ** paragraphs 
                lineHcount += texts.length;
            }
        } else {
            //This is so bad please fix in the future
            let text = complete[currentCreature][use.text];
            if (text.includes('**')) {
                text = complete[currentCreature][use.text].split('**');
                for (var p = 0; p<text.length; p++)
                    ctx.fillText(text[p], use.pos.x, use.pos.y + (p*use_fontLH) );
            } else {
                ctx.fillText(complete[currentCreature][use.text], use.pos.x, use.pos.y);
            }
        }

        if (i < end) applyLayer(i + 1,end,anychecked);
    }
}
function drawCard() {
    //Clear Card
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,card_width,card_height);
    //Checking if any of the 'names' numebrs (1-5) are checked to apply different effects
    let anychecked = false;
    if (currentCreature) {
        for (let i = 1; i < 6; i++) {
            if ($(complete[currentCreature][0] + i).checked) anychecked = i;
        }
    }
    //Draw Through Each Layer if there are layers
    if (layers.length > 0) applyLayer(0,layers.length-1,anychecked)
}


///////////////////////
//  On Input Events  //
///////////////////////
{
    $('s_x').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].pos.x = this.value;
            } else layers[currentLayer].pos.x = this.value;
            drawCard();
        }
    }
    $('s_y').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].pos.y = this.value;
            } else {
                layers[currentLayer].pos.y = this.value;
            }
            drawCard();
        }
    }
    $('s_scale').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].size = this.value;
            } else layers[currentLayer].size = this.value;
            drawCard();
        }
    }
    $('s_src').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].src = this.value;
            } else layers[currentLayer].src = this.value;
            drawCard();
        }
    }
    
    
    $('s_fontf').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontF = this.value;
            } else layers[currentLayer].fontF = this.value;
            drawCard();
        }
    }
    $('s_fonts').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontS = this.value;
            } else layers[currentLayer].fontS = this.value;
            drawCard();
        }
    }
    $('s_fontc').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontC = this.value;
            } else layers[currentLayer].fontC = this.value;
            drawCard();
        }
    }
    $('s_fontww').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontWW = this.value;
            } else layers[currentLayer].fontWW = this.value;
            drawCard();
        }
    }
    $('s_fontlh').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontLH = this.value;
            } else layers[currentLayer].fontLH = this.value;
            drawCard();
        }
    }
    $('s_fontta').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontTA = this.checked;
            } else layers[currentLayer].fontTA = this.checked;
            drawCard();
        }
    }
    $('s_fonti').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) layers[currentLayer].sets[currentNumberVersion - 1].fontI = this.checked;
            else layers[currentLayer].fontI = this.checked;
            drawCard();
        }
    }
    $('s_fontb').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) layers[currentLayer].sets[currentNumberVersion - 1].fontB = this.checked;
            else layers[currentLayer].fontB = this.checked;
            drawCard();
        }
    }
    
    $('canvas_height').oninput = function() {
        runCanvasSizing();
    }
    $('canvas_width').oninput = function() {
        runCanvasSizing();
    }
    $('canvas_scale').oninput = function() {
        runCanvasSizing();
    }
}
//////////////////////////
//  End On Input Event  //
//////////////////////////



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
            fontS: 20,
            fontLH: 20,
            fontTA: false,
            fontB: false,
            fontI: false,

            sets: [{},{},{},{},{}],
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

            sets: [{},{},{},{},{}],
        })
        let img = new Image();
        let htmlImg = $('allImages').create('img');
        htmlImg.src = currentLabel;
        img.onload = function() {
            allImages.push({
                img: this,
                layer: layers.length - 1,
                htmlImg: htmlImg,
            })
        }
        img.src = currentLabel;

        currentLayer = layers.length - 1;
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }
}
/*
Name	Race	State	Cards	Life	Attack	Agility	Gold 	XP	VP	Text	Template	Profile	Life icon	Agility icon	Attack icon	XP icon	Gold icon	VP Icon	Ability	Effect	Name2
Kobald	Imp	Living	1	4	3	1	2	3	2	These stout creatures can understand some human speak.  Unfortunately they are still too primal to reason with	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Kobold.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Ooze	Slime	Undead	2	3	2	2	1	2	1	Ooze are the failed attempts of a necromancer's reanimation.  Their minds are all but gone with only one impulse, consume everything around. 	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Ooze.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Rat	Beast	Living	1	1	1	1	1	1	1	A small rat is scavenging the area.	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Large Rat.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Will-O-Wisp	Sprite	Living	1	2	2	0	1	1	1	These puffs of magic are freed spites from fallen sorcerers	R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Wil-O-Wisp.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/Magic Attack Icon.png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png			
Cavernous Spider	Arachnid	Living	1	2	2	1	1	3	1		R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Cavernous Spider.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/attak(1).png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png	When a Cavernous Spider does damage to a character roll 1D20. 1-14, nothing happens. 15-20, place a poison token on the damaged character.		
Flare (Boss)	Elemental	Living	1	5	3	3	3	5	3		R:/Rogue/Dungeons/Dungeon 1/template1.png	R:/Rogue/Dungeons/Dungeon 1/Fire Spirit(Boss).png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png	R:/Rogue/Icons/Used/Magic Attack Icon.png	R:/Rogue/Icons/Used/experience(1).png	R:/Rogue/Icons/Used/coins(1).png	R:/Rogue/Icons/Used/victory(1).png	Every time Flare moves he performs 1 attack on all figures, creatures and walls adjacent to his new location. Defenders only roll defence and cannot cause damage while defending from this attack. Flare is Immune to fire.		
			3								R:/Rogue/Dungeons/Dungeon 1/template3.png	R:/Rogue/Dungeons/Dungeon 1/Level 1 Healing Circle.png								Though it is weak, you can feel a cleansing power resonating from this location. Roll 4 attack dice and heal 1 life for every hit.	Healing Circle
			2								R:/Rogue/Dungeons/Dungeon 1/template3.png	R:/Rogue/Dungeons/Dungeon 1/cavern.png								Roll 1D20. 1-10, replace this card with the top card of the dungeon deck and encounter it as though you had attempted to capture it. 11-15, Draw a card from the random item deck. 16-20, encounter the top card on the stranger deck.	Cavern 
			1	1		6					R:/Rogue/Dungeons/Dungeon 1/template2.png	R:/Rogue/Dungeons/Dungeon 1/Wall 1.png	R:/Rogue/Icons/Used/life(1).png	R:/Rogue/Icons/Used/agil_ity.png						When attempting to capture a wall perform one attack. If you succeed in causing damage you captured the wall. Each wall can only have one capture attempt per turn.	Wall
			2								R:/Rogue/Dungeons/Dungeon 1/template3.png	R:/Rogue/Dungeons/Dungeon 1/Level 1 Chest.png								Roll 1D20 and add your agility to the roll. 1-10, failed to open, suffer a 5 damage trap and remove this card. 11-13, there is a bomb in the chest. 14-15, a level stone, roll 2D4 and get your level reward. 16+ draw the top card in the item deck.	Chest
*/

/*
Name	Cards	Life	Attack	Agility	Items	Strength	Template	Portrait	SN1	SN2	USN1	USN2	USN3	SN1 stat	SN2 stat	USN1 stat	USN2 stat	USN3 stat	upgrade2	upgrade3	upgrade4	upgrade5	upgrade6	upgrade7	upgrade8	Text	Text Line B 
Warrior	1	15	1	1	4	4	R:\Rogue\Characters\Character card templates\characters sheet bis2.png	R:\Rogue\Characters\Portraits\warrior.png	Heal	Power				12	1				2: +1 Agility	3: +1 Power	4: +2 Life	5: +1 Strength	6: +1 Item	7: +1 Heal	8: +1 Attack	Revive: At the start of each of the Warrior's turns he may attempt to heal.  Roll attack dice equal to his Heal stat.  Heal one life for each hit.****Power: Before combat choose to empower your Attack or Agility.  After you roll your dice, so long as at least one of the chosen dice was a succesful Hit/Dodge add your power stat to that total.	
Wizard	1	10	1	1	4	3	R:\Rogue\Characters\Character card templates\characters sheet bis3(2).png	R:\Rogue\Characters\Portraits\wizard.png			Channeling	Wisdon	Max Mana			1	1	5	2: +1 Agility	3: +1 Wisdom	4: +2 Life	5: +1 Max Mana	6: +1 Item	7: +1 Channeling	8: +1 Attack	Scholar: The Wizard may use mana to not discard a spell after use.  The Mana Cost is indicated on each spell card.  Each spell also indicates an increase of power for each Wisdom stat the Wizard has.****Channeling: At the start of each of teh Wizards turns the Wizard increases her mana by her channeling.  The Wizard's mana cannot go higher than the wizard's Max Mana stat.	
Rogue	1	10	0	2	4	2	R:\Rogue\Characters\Character card templates\characters sheet bis2.png	R:\Rogue\Characters\Portraits\rogue(1).png	Avoid Traps	Pick Locks				16	3				2: +1 Agility	3: +1 Pick Locks	4: +2 Life	5: +1 Strength	6: +1 Item	7: +1 Avoid Traps	8: +1 Attack	Tricky: The Rogue's attack can't go above 0 even with equipment and stat bonuses. Every excess block counts as a hit.  Hits caused by tricky ignore the defenders Agility roll.****Pick Lock: When picking locks add your Lock Pick Stat to your roll.****Avoid Traps: When encountering a trap you may attempt to avoid the trap.  Roll 1D20, if the result is higher than or equal to your Avoid Trap Stat then you may ignore all effects on that trap card.	
Alchemist	1	10	1	1	4	2	R:\Rogue\Characters\Character card templates\characters sheet bis2.png	R:\Rogue\Characters\Portraits\alchmimist.png	Brew	Potion Strength				11	2				2: +1 Agility	3: +1 Potion Strength	4: +2 Life	5: +1 Strength	6: +1 Item	7: -1 Brew	8: +1 Attack	Brew Potion: At the start of each of the Alchemist's turn the Alchemist may attempt to brew one potion.  Roll 1D20 if the result is equal to or higher than your brew stat then remove one empty vile token from any of your potions.****Potion Strength: Add dice equal to your Potion Strength stat when using a potion.	
Assassin	1	10	1	1	4	3	R:\Rogue\Characters\Character card templates\characters sheet bis2.png	R:\Rogue\Characters\Portraits\assassin.png	Shift	Run Away				14	2				2: +1 Agility	3: +1 Run Away	4: +2 Life	5: +1 Strength	6: +1 Item	7: -1 Shift	8: +1 Attack	Shift: At the start of the assassin's turn the Assassi may attempt one Shift.  Choose a tile adjacent to the Assassin and roll 1D20, if the result is equal to or higher than the Assassin's Shift stat then switch positions with any card or tokens on that tile.****First Strike: If the Assassin's attack kills it's target, or if she would inflict twice the damage she would recieve then the Assassin ignores all hit markers on the enemies dice.	
Priest	1	10	1	1	4	3	R:\Rogue\Characters\Character card templates\characters sheet bis2.png	R:\Rogue\Characters\Portraits\priest.png	Devotion	Faith				1	1				2: +1 Agility	3: +1 Devotion	4: +2 Life	5: +1 Strength	6: +1 Item	7: +1 Faith	8: +1 Attack	Devine Guidance: The Priest may perform one additional prayer at the end of his turn.****Devine Interventions:At any time the priest may spend any or all of his faith to increase any of his stats until the end of his turn.  Place any spent faith marker on any stat you want to improve.  Those stats are now improved by your devotion x faith on each stat.  At the end of your turn remove all faith spent this way.****A Soul's Ransom: When the Priest levels up on an alter tile he may gain 2 faith for each trophy traded.  Trophies traded this way can't come back as undead creatures.****Faith Milestone:As Faith increases the Priest recieves bonuses based on his current Faith.**2: Reroll one die while praying**4: Reroll 1 agility die**6:+1 die when praying (2)**8: +1 reroll when praying. (2)**10: Reroll 1 attack roll per combat.	12: +1 die when praying. (3)**14: +1 reroll when praying (3)**16: +2 Agility rerolls per combat. (3)**18 : +1 die when praying (4)**20: +2 attack rerolls. (3)
*/

importSheet(String.raw`Name	Cards	Template	Portrait	Cost	Sell	Strength	Attack/armor	Agility	Durability	Gold icon	Text	Shop
Dagger	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\dagger.png	Buy 3	Sell 1	Strength 1	Attack +1		Durability 4	R:\Rogue\Icons\Used\coins(2).png		R:\Rogue\Characters\Shop Icons\Warriors mini icon.png
Helm	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\helmet.png	Buy 5	Sell 2	Strength 1	Armor 3			R:\Rogue\Icons\Used\coins(2).png		R:\Rogue\Characters\Shop Icons\Warriors mini icon.png
Plated Gloves	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\gzantsd.png	Buy 10	Sell 5	Strength 1	Attack +1	Agility +1	Durability 4	R:\Rogue\Icons\Used\coins(2).png		R:\Rogue\Characters\Shop Icons\Warriors mini icon.png
Sword	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\sword.png	Buy 10	Sell 5	Strength 3	Attack +3		Durability 8	R:\Rogue\Icons\Used\coins(2).png		R:\Rogue\Characters\Shop Icons\Warriors mini icon.png
Plate Armor	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\plate armor.png	Buy 15	Sell 7	Strength 3	Armor 8			R:\Rogue\Icons\Used\coins(2).png		R:\Rogue\Characters\Shop Icons\Warriors mini icon.png
Warhammer	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\hammer.png	Buy 16	Sell 8	Strength 4	Attack +2		Durability 10	R:\Rogue\Icons\Used\coins(2).png	Increase Attack by excess Strength	R:\Rogue\Characters\Shop Icons\Warriors mini icon.png
Mithril Armor	2	R:\Rogue\Characters\Item card templates\items nis(1).png	R:\Rogue\Characters\Shop Items\Chain Mill Armor.png	Buy 30	Sell 15	Strength 4	Armor 15			R:\Rogue\Icons\Used\coins(2).png		R:\Rogue\Characters\Shop Icons\Warriors mini icon.png`);
function importSheet(txt2) {
    let txt = txt2 ? txt2 : prompt('Paste Your Sheet:');
    txt = (txt).replace(/\\/g,"/");
    let arr = txt.split('\n');
    currentCreature = 1;
    complete = [];
    for (let i = 0; i < arr.length; i++) {
        complete.push(arr[i].split('	'));
    }

    let labels = $('labels');
    labels.innerHTML = '';
    for (let i = 0; i < complete[0].length; i++) {
        if (complete[0][i].toLowerCase() == 'template') {
            let tempImg = new Image();
            tempImg.onload = function() {
                card_width = this.naturalWidth;
                card_height = this.naturalHeight;
                $('canvas_width').value = card_width;
                $('canvas_height').value = card_height;
                runCanvasSizing();
            }
            tempImg.src = complete[1][i];
        }
        let btn = labels.create('button');
        btn.innerHTML = complete[0][i];
        btn.i = i;
        btn.id = 'i' + i;
        btn.onclick = function() {
            for (let k = 0; k < complete[0].length; k++) {
                $('i' + k).style.background = '#efefef';
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
        btn.id = 'switchButton';
        if (i == 1) btn.style.background = 'gold';
        btn.onclick = function() {
            for (let k = 0; k < document.querySelectorAll('#switchButton').length; k++) {
                document.querySelectorAll('#switchButton')[k].style.background = '#efefef';
            }
            this.style.background = 'gold';
            currentCreature = this.i;
            drawCard();
        }

        //Create Buttons and Text 1-5
        for (let b = 1; b < 6; b++) {
            let check = swtch.create('input');
            check.type = 'checkbox';
            check.className = 'switchNumber';
            check.id = complete[i][0] + b;
            check.family = complete[i][0];
            check.i = b;
            check.onclick = function() {
                for (let i = 1; i < 6; i++) {
                    if (this.i !== i) $(this.family + i).checked = false;
                }
                drawCard();
            }
            let a = swtch.create('div');
            a.className = 'switchNumber';
            a.innerHTML = b;
        }
    }
    drawCard();
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
//Tiles
//[{"name":"Profile","size":"190","pos":{"x":"60","y":"50"},"type":"image","src":12},{"name":"Template","size":"76","pos":{"x":0,"y":0},"type":"image","src":11},{"name":"Attack icon","size":"30","pos":{"x":"0465","y":"225"},"type":"image","src":15},{"name":"Life icon","size":"30","pos":{"x":"465","y":"40"},"type":"image","src":13},{"name":"Agility icon","size":"25","pos":{"x":"470","y":"130"},"type":"image","src":14},{"name":"XP icon","size":"30","pos":{"x":"465","y":"310"},"type":"image","src":16},{"name":"Gold icon","size":"30","pos":{"x":"465","y":"395"},"type":"image","src":17},{"name":"VP Icon","size":"30","pos":{"x":"465","y":"490"},"type":"image","src":18},{"name":"Life","size":100,"pos":{"x":"530","y":"105"},"type":"text","text":4,"fontC":"black","fontF":"Arial","fontS":"30","fontLH":"20","fontWW":"false","fontST":"italic","fontTA":true},{"name":"Agility","size":100,"pos":{"x":"530","y":"195"},"type":"text","text":6,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15,"fontTA":true},{"name":"Attack","size":100,"pos":{"x":"522","y":"288"},"type":"text","text":5,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"XP","size":100,"pos":{"x":"522","y":"378"},"type":"text","text":8,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Gold ","size":100,"pos":{"x":"522","y":"467"},"type":"text","text":7,"fontC":"black","fontF":"arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"VP","size":100,"pos":{"x":"522","y":"558"},"type":"text","text":9,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Name","size":100,"pos":{"x":"45","y":"450"},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"23","fontLH":15},{"name":"Race","size":100,"pos":{"x":"275","y":"452"},"type":"text","text":1,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"22","fontLH":15},{"name":"State","size":100,"pos":{"x":"360","y":"452"},"type":"text","text":2,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"22","fontLH":15},{"name":"Text","size":100,"pos":{"x":"35","y":"475"},"type":"text","text":10,"fontC":"black","fontF":"Arial","fontWW":"400","fontST":"italic","fontS":"17","fontLH":"17","fontTA":false},{"name":"Ability","size":100,"pos":{"x":"35","y":"475"},"type":"text","text":19,"fontC":"black","fontF":"Arial","fontWW":"400","fontST":"normal","fontS":"17","fontLH":"18"},{"name":"Effect","size":100,"pos":{"x":"35","y":"455"},"type":"text","text":20,"fontC":"black","fontF":"Arial","fontWW":"520","fontST":"normal","fontS":20,"fontLH":"20"},{"name":"Name2","size":100,"pos":{"x":"50","y":"425"},"type":"text","text":21,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"23","fontLH":15}]
//Player Cards
//[{"name":"Portrait","size":270,"pos":{"x":74,"y":67},"type":"image","src":8},{"name":"Template","size":100,"pos":{"x":0,"y":0},"type":"image","src":7},{"name":"Name","size":"100","pos":{"x":743,"y":152},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"75","fontLH":15,"fontTA":false},{"name":"Text","size":100,"pos":{"x":639,"y":178},"type":"text","text":26,"fontC":"#6bd2fe","fontF":"Arial","fontWW":"950","fontST":"normal","fontS":"26","fontLH":"23","fontTA":false},{"name":"Life","size":100,"pos":{"x":"127","y":"677"},"type":"text","text":2,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"28","fontLH":"15","fontTA":true},{"name":"Attack","size":100,"pos":{"x":"280","y":677},"type":"text","text":3,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"Agility","size":100,"pos":{"x":"456","y":677},"type":"text","text":4,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"Items","size":100,"pos":{"x":"179","y":744},"type":"text","text":5,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"Strength","size":100,"pos":{"x":"402","y":746},"type":"text","text":6,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"SN1","size":100,"pos":{"x":123,"y":818},"type":"text","text":9,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"SN2","size":100,"pos":{"x":352,"y":818},"type":"text","text":10,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"USN1","size":100,"pos":{"x":74,"y":818},"type":"text","text":11,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"USN2","size":100,"pos":{"x":266,"y":818},"type":"text","text":12,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"USN3","size":100,"pos":{"x":438,"y":818},"type":"text","text":13,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"SN1 stat","size":100,"pos":{"x":90,"y":821},"type":"text","text":14,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"SN2 stat","size":100,"pos":{"x":326,"y":821},"type":"text","text":15,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"USN1 stat","size":100,"pos":{"x":"55","y":818},"type":"text","text":16,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"USN2 stat","size":100,"pos":{"x":"238","y":818},"type":"text","text":17,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"USN3 stat","size":100,"pos":{"x":418,"y":818},"type":"text","text":18,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"upgrade2","size":100,"pos":{"x":699,"y":698},"type":"text","text":19,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade3","size":100,"pos":{"x":699,"y":753},"type":"text","text":20,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade4","size":100,"pos":{"x":699,"y":812},"type":"text","text":21,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade5","size":100,"pos":{"x":988,"y":698},"type":"text","text":22,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade6","size":100,"pos":{"x":988,"y":"753"},"type":"text","text":23,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade7","size":100,"pos":{"x":"988","y":"812"},"type":"text","text":24,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade8","size":100,"pos":{"x":1301,"y":753},"type":"text","text":25,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Text Line B ","size":100,"pos":{"x":1133,"y":500},"type":"text","text":27,"fontC":"#6bd2fe","fontF":"Arial","fontWW":"950","fontST":"normal","fontS":"26","fontLH":"23","fontTA":false,"scale":"100"}]
paste(String.raw`[{"name":"Portrait","size":244,"pos":{"x":87,"y":84},"type":"image","src":3},{"name":"Template","size":100,"pos":{"x":0,"y":0},"type":"image","src":2},{"name":"Name","size":100,"pos":{"x":108,"y":535},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"30","fontLH":15,"fontTA":false},{"name":"Gold icon","size":100,"pos":{"x":568,"y":200},"type":"image","src":10,"scale":"100","fontF":"Arial","fontST":"normal","fontWW":"","fontS":"35","fontC":"#000000","fontLH":"15"},{"name":"Cost","size":100,"pos":{"x":616,"y":386},"type":"text","text":4,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"35","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Sell","size":100,"pos":{"x":616,"y":434},"type":"text","text":5,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"35","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Attack/armor","size":100,"pos":{"x":155,"y":575},"type":"text","text":7,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Durability","size":100,"pos":{"x":154,"y":644},"type":"text","text":9,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Agility","size":100,"pos":{"x":345,"y":575},"type":"text","text":8,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Text\r","size":100,"pos":{"x":100,"y":681},"type":"text","text":11,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Strength","size":100,"pos":{"x":155,"y":608},"type":"text","text":6,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Shop\r","size":87,"pos":{"x":581,"y":58},"type":"image","src":12}]`)
function paste(strs) {
    let str = strs ? strs : prompt('Paste Your Layer String Below:');
    layers = JSON.parse(str)

    //To Fix Past Versions, Can Delete
    //If Past Layers Don't Include Sets 
    for (let i = 0; i < layers.length; i++) {
        if (!layers[i].sets) {
            layers[i].sets = [{},{},{},{},{}];
        }
    }
    


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

function closeLayout() {
    $('layoutBB').style.display = 'none';
    fcanvas.style.display = 'none';
    $('normalBB').style.display = 'block';
}
function copyFormat() {
    copiedFormat = {
        scale: $('s_scale').value,
        x: $('s_x').value,
        y: $('s_y').value,
        fontFamily: $('s_fontf').value,
        wordWrap: $('s_fontww').value,
        fontSize: $('s_fonts').value,
        fontColor: $('s_fontc').value,
        lineHeight: $('s_fontlh').value,
        fontTA: $('s_fontta').value,
        fontI: $('s_fonti').value,
        fontB: $('s_fontb').value,
    }
}
function pasteFormat() {
    if (currentLayer !== false) {
        layers[currentLayer].scale = copiedFormat.scale;
        layers[currentLayer].pos.x = copiedFormat.x;
        layers[currentLayer].pos.y = copiedFormat.y;
        layers[currentLayer].fontF = copiedFormat.fontFamily;
        layers[currentLayer].fontWW = copiedFormat.wordWrap;
        layers[currentLayer].fontS = copiedFormat.fontSize;
        layers[currentLayer].fontC = copiedFormat.fontColor;
        layers[currentLayer].fontLH = copiedFormat.lineHeight;
        layers[currentLayer].fontTA = copiedFormat.fontTA;
        layers[currentLayer].fontI = copiedFormat.fontI;
        layers[currentLayer].fontB = copiedFormat.fontB;
        renderLayers();
    }
}



let fcanvas = $('final');
fctx = fcanvas.getContext('2d');

function askLayout() {
    $('layoutSettings').style.display = 'block';
    //Delete All Options On Layout Settings Drop Down
    $('canvasFinalCards').innerHTML = '';
    //Create All Options For Layout Settings Drop Down
    for (let i = 0; i < complete[0].length; i++) {
        let a = $('canvasFinalCards').create('option');
        a.value = complete[0][i];
        a.innerHTML = complete[0][i];
        if (a.value == 'Cards') $('canvasFinalCards').value = 'Cards';
    }
}
function importLayout() {
    $('layoutSettings').style.display = 'none';
    $('normalBB').style.display = 'none';
    $('layoutBB').style.display = 'block';
    //Set Canvas Scale Back To 100
    let saveScale = card_scale;
    card_scale = 100;
    drawCard();

    fcanvas.style.display = 'block';
    let sum = [];
    let useLabel = 0;
    for (let i = 0; i < complete[0].length; i++) {
        if ($('canvasFinalCards').value == complete[0][i]) {
            useLabel = i;
        }
    }
    for (let i = 1; i < complete.length; i++) {
        sum.push(Number(complete[i][useLabel]));    
    }

    let finalCardsWidth = $('canvasWidthFinal').value ? Number($('canvasWidthFinal').value) : Number($('canvasWidthFinal').placeholder);
    //Find out how many cards there are
    let ct = 0;
    for (let i = 0; i < sum.length; i++) {
        ct += sum[i];
    }
    let finalCardsHeight = Math.ceil(ct / finalCardsWidth);
    fcanvas.style.width = card_width * finalCardsWidth;
    fcanvas.style.height = card_height * finalCardsHeight;
    fcanvas.width = Math.floor(card_width*finalCardsWidth*scale);
    fcanvas.height = Math.floor(card_height*finalCardsHeight*scale);


    fctx.clearRect(0, 0, fcanvas.width, fcanvas.height);

    let cards = 0;

    let i = -1;
    let loop = setInterval(function() {
        i++;
        $('leave_percent').innerHTML = cards + '/' + ct; 
        if (i >= sum.length) {
            clearInterval(loop);
        } else {
            currentCreature = i + 1;
            drawCard();
            setTimeout(function() {
                for (let j = 0; j < sum[i]; j++) {
                    cards++;
                    fctx.drawImage(ctx.canvas, (((cards-1) % finalCardsWidth)) * card_width, (card_height * ((Math.ceil(cards/finalCardsWidth))-1)));
                }
            },50)
        }
    },100)
    
    //Set Canvas Scale Back To Original
    $('leave_percent').innerHTML = 'Finished'; 
    card_scale = saveScale;
    drawCard();
}


let keysDown = {
    s: false,
    g: false,
}

let lock2 = false;
document.body.onkeydown = function(e) {
    switch(e.key) {
        case 's':
            if (keysDown.control) e.preventDefault();
            if (layers[currentLayer]) {
                if (layers[currentLayer].type == 'image') {
                    origin.savedSize = layers[currentLayer].size;
                }
                if (layers[currentLayer].type == 'text') {
                    origin.savedFontS = Number(layers[currentLayer].fontS);
                }
                origin.sizeX = oldx;
            }
            keysDown.s = true;
            break;
        case 'd':
            if (keysDown.control) e.preventDefault();
            keysDown.d = true;
            break;
        case 'Control':
            if (!lock2) {
                lock2 = true;
                origin.x = oldx;
                origin.y = oldy;
                if (layers[currentLayer]) {
                    origin.savedX = Number(layers[currentLayer].pos.x);
                    origin.savedY = Number(layers[currentLayer].pos.y);
                }
                origin.savedCS = Number($('canvas_scale').value);
            }
            keysDown.control = true;
            break;
    }
}
document.body.onkeyup = function(e) {
    switch(e.key) {
        case 's':
            keysDown.s = false;
            break;
        case 'd':
            keysDown.d = false;
            break;
        case 'Control':
            lock2 = false;
            lockedDir = false;
            keysDown.control = false;
            break;
    }
}

var oldx = 0;
var oldy = 0;
let mouseSpeed = 0;
let mouseSpeedY = 0;
let lockedDir = false;
let origin = {
    x: false,
    y: false,
    savedX: false,
    savedY: false,
}

//Control Events When The Mouse is Moved, like control d and s etc..
document.onmousemove = function(e) {
    let use = currentLayer !== false ? layers[currentLayer] : false;
    if (currentNumberVersion) use = layers[currentLayer].sets[currentNumberVersion-1];
    console.log(layers[currentLayer].sets[currentNumberVersion-1]);

    //Control Canvas Scaling and Style Scaling
    if (keysDown.s && keysDown.control) {
        $('canvas_scale').value = origin.savedCS + ((e.pageX - origin.x)/5);
        runCanvasSizing();
    } else if(keysDown.s && currentLayer !== false) {
        if (use.type == 'text') {
            use.fontS = origin.savedFontS + ((e.pageX - origin.sizeX)/5); //Number(use.fontS) + Number($('s_scroll').value);
        }
        if (use.type == 'image') {
            use.size = origin.savedSize + ((e.pageX - origin.sizeX)/5);
        }
        renderLayers(currentNumberVersion);
    }

    if (keysDown.d && !keysDown.control && currentLayer !== false) {
        use.pos.x = Number(use.pos.x) + mouseSpeed;
        use.pos.y = Number(use.pos.y) + mouseSpeedY;
        renderLayers(currentNumberVersion);
    } else if (keysDown.d && keysDown.control && currentLayer !== false) {
        if (!lockedDir) {
            if (Math.abs(mouseSpeed) < Math.abs(mouseSpeedY)) {
                lockedDir = 'y';
            } else {
                lockedDir = 'x';
            }
        } else {
            if (Math.abs(e.pageX - origin.x) < Math.abs(e.pageY - origin.y)) {
                lockedDir = 'y';
                use.pos.x = origin.savedX;
            } else {
                lockedDir = 'x';
                use.pos.y = origin.savedY;
            }
        }
        if (lockedDir == 'y') {
            use.pos.y = origin.savedY + e.pageY - origin.y
        } else {
            use.pos.x = origin.savedX + e.pageX - origin.x;
        }
        renderLayers(currentNumberVersion);
    }

    
    mouseSpeed = e.pageX - oldx;
    oldx = e.pageX;
    mouseSpeedY = e.pageY - oldy;
    oldy = e.pageY;
}

