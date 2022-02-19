/////////////////
//  Variables  //
/////////////////
let savedSheets = localStorage.getItem('sheets') ? JSON.parse(localStorage.getItem('sheets')) : [];
let complete = [];
let layers = [];
let allImages = [];
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

let currentLayer = false;
let currentCreature = false;
let currentLabel = false;
let currentNumberVersion = false;
let currentSheet = false;
let currentSheetMenu = false;

let canvas = $("card");
let ctx = canvas.getContext('2d');
let scale = window.devicePixelRatio;
let card_width = Number($('canvas_width').value);
let card_height = Number($('canvas_height').value);
let card_scale = 100;

let fcanvas = $('final');
let fctx = fcanvas.getContext('2d');

//For Key Down/Mouse Events
let keysDown = {
    s: false,
    g: false,
    shift: false,
    control: false,
}
let lock2 = false;
let lockD = false;
let lockS = false;

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
/////////////////////
//  End Variables  //
/////////////////////


sizeCanvas();
function sizeCanvas() {
    let roomX = window.innerWidth - 600
    let roomY = window.innerHeight - 50
    let val1 = (roomX*0.95) / card_width * 100;
    let val2 = (roomY*0.95) / card_height * 100;
    if (val1 < val2) $('canvas_scale').value = val1;
    else $('canvas_scale').value = val2;
    runCanvasSizing();
}

window.onresize = function() {
    sizeCanvas();
}

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

//Control Layers Set Checkboxes, only one can be pressed
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
    for (let i = layers.length - 1; i > -1; i--) {
        //Creating A New Layer (Left menu layer items)
        let div = obj_layers.create('div');
        div.innerHTML = layers[i].name;
        div.i = i;
        if (layers[i].type == 'image') div.id='nimage';
        if (layers[i].type == 'text') div.id='ntext';
        div.className = 'nlayer';
        if (currentLayer === i)  {
            div.id = 'ngold';

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
            
        }

        div.onclick = function() {
            uncheckallSwitch();
            $('tableText').style.display = 'none';
            $('tableImage').style.display = 'none';
            if (currentLayer === this.i) {
                currentLayer = false;
                $('controlSettings').style.display = 'none';
            } else {
                currentLayer = this.i;
                $('controlSettings').style.display = 'block';
                if (layers[currentLayer].type == 'text') $('tableText').style.display = 'block';
                if (layers[currentLayer].type == 'image') $('tableImage').style.display = 'block';
            }
            renderLayers();
        }

    }
    drawCard();
}


function drawCard() {
    //Clear Card
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,card_width,card_height);
    //Checking if any of the 'names' numebrs (1-5) are checked to apply different effects
    let anychecked = false;
    if (currentCreature) {
        for (let i = 1; i < 6; i++) {
            if ($(appFormat(complete[currentCreature][0]) + i).checked) anychecked = i;
        }
    }
    //Draw Through Each Layer if there are layers
    if (layers.length > 0) applyLayer(0,layers.length-1,anychecked)
}
function applyLayer(i,end,anychecked) {
    //Catch If End Is Greater Than Amount Of Layers
    if (i > layers.length - 1) {
        if (i < end) applyLayer(i + 1,end,anychecked);
        return;
    }

    let use = layers[i];
    if (anychecked) use = layers[i].sets[anychecked-1];

    if (Object.keys(use).length === 0) {
        use = layers[i];
        /*
        layers[i].sets[anychecked - 1] = JSON.parse(JSON.stringify( layers[i] ));
        use = layers[i].sets[anychecked-1];
        */
    }
    if (layers[i].type == 'image') {
        let useNum = false;
        if (!layers[i].label) layers[i].label = complete[0][layers[i].src];
        for (let k = 0; k < complete[0].length; k++) {
            if (layers[i].label == complete[0][k]) useNum = k;
        }
        //If Layer Couldn't Find Label
        if (!useNum) {
            if (i < end) applyLayer(i + 1,end,anychecked);
            return;
        }

        if (complete[currentCreature][useNum]) {
            let fimg = false;
            //Go Through All Images And See If Needed SRC is the same
            for (let k = 0; k < allImages.length; k++) {
                if (complete[currentCreature][allImages[k].src] == complete[currentCreature][useNum] && allImages[k].switch == currentCreature) { 
                    fimg = allImages[k].htmlImg;
                }
            }

            if (!fimg) {
                var img = new Image();
                let htmlImg = $('allImages').create('img');
                htmlImg.src = complete[currentCreature][useNum];
                img.num = useNum;
                img.onload = function() {
                    allImages.push({
                        src: img.num,
                        htmlImg: htmlImg,
                        switch: currentCreature,
                    })
    
                    let wid = img.naturalWidth * (use.size/100);
                    let hie = img.naturalHeight * (use.size/100)
                    ctx.drawImage(img, use.pos.x, use.pos.y,wid,hie);
                    if (i < end) applyLayer(i + 1,end,anychecked);
                }
                img.src = complete[currentCreature][useNum];
            } else {
                let wid = fimg.naturalWidth * (use.size/100);
                let hie = fimg.naturalHeight * (use.size/100)
                ctx.drawImage(fimg, use.pos.x, use.pos.y,wid,hie);
                if (i < end) applyLayer(i + 1,end,anychecked);
            }
        } else {
            if (i < end) applyLayer(i + 1,end,anychecked);
        }
        
    }
    if (layers[i].type == 'text') {
        let useNum = false;
        if (!layers[i].label) layers[i].label = complete[0][layers[i].text];
        for (let k = 0; k < complete[0].length; k++) {
            if (layers[i].label == complete[0][k]) useNum = k;
        }
        //If Layer Couldn't Find Label
        if (useNum === false) {
            if (i < end) applyLayer(i + 1,end,anychecked);
            return;
        }

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
            let layeredText = [complete[currentCreature][useNum]];
            if (complete[currentCreature][useNum].includes('**')) {
                layeredText = complete[currentCreature][useNum].split('**');
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
            //If UseNum (The Number on complete[0][usenum]) isn't bigger than the amount of elements in the spreadsheet
            if (useNum < complete[currentCreature].length) {
                let text = complete[currentCreature][useNum];
                if (text.includes('**')) {
                    text = complete[currentCreature][useNum].split('**');
                    for (var p = 0; p<text.length; p++)
                        ctx.fillText(text[p], use.pos.x, use.pos.y + (p*use_fontLH) );
                } else {
                    ctx.fillText(complete[currentCreature][useNum], use.pos.x, use.pos.y);
                }
            }
        }

        if (i < end) applyLayer(i + 1,end,anychecked);
    }
}



///////////////////////
//  On Input Events  //
///////////////////////
{
    $('s_x').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].pos.x = Number(this.value);
            } else layers[currentLayer].pos.x = Number(this.value);
            drawCard();
        }
    }
    $('s_y').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].pos.y = Number(this.value);
            } else {
                layers[currentLayer].pos.y = Number(this.value);
            }
            drawCard();
        }
    }
    $('s_scale').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].size = Number(this.value);
            } else layers[currentLayer].size = Number(this.value);
            drawCard();
        }
    }
    
    
    $('s_fontf').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontF = Number(this.value);
            } else layers[currentLayer].fontF = Number(this.value);
            drawCard();
        }
    }
    $('s_fonts').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontS = Number(this.value);
            } else layers[currentLayer].fontS = Number(this.value);
            drawCard();
        }
    }
    $('s_fontc').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontC = Number(this.value);
            } else layers[currentLayer].fontC = Number(this.value);
            drawCard();
        }
    }
    $('s_fontww').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontWW = Number(this.value);
            } else layers[currentLayer].fontWW = Number(this.value);
            drawCard();
        }
    }
    $('s_fontlh').oninput = function() {
        if (currentLayer !== false) {
            if (currentNumberVersion !== false) {
                layers[currentLayer].sets[currentNumberVersion - 1].fontLH = Number(this.value);
            } else layers[currentLayer].fontLH = Number(this.value);
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

    document.body.onkeydown = function(e) {
        switch(e.key) {
            case 's':
                if (keysDown.control) e.preventDefault();
                if (!lockS) {
                    lockS = true;
                    if (layers[currentLayer]) {
                        let use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                        if (layers[currentLayer].type == 'image') {
                            origin.savedSize = Number(use.size);
                        }
                        if (layers[currentLayer].type == 'text') {
                            origin.savedFontS = Number(use.fontS);
                        }
                        origin.sizeX = oldx;
                    }
                }
                keysDown.s = true;
                break;
            case 'Delete':
                if (currentLayer !== false) deleteLayer();
                break;
            case 'd':
                if (keysDown.control) e.preventDefault();
                keysDown.d = true;
                if (!lockD) {
                    lockD = true;
                    if (currentLayer !== false) {
                        let use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                        origin.d = {};
                        origin.d.x = oldx;
                        origin.d.y = oldy;
                        origin.d.savedx = use.pos.x;
                        origin.d.savedy = use.pos.y;
                    }
                }
                break;
            case 'Shift':
                keysDown.shift = true;
                break;
            case 'Control':
                if (!lock2) {
                    lock2 = true;
                    origin.x = oldx;
                    origin.y = oldy;
                    if (layers[currentLayer]) {
                        let use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                        origin.savedX = Number(use.pos.x);
                        origin.savedY = Number(use.pos.y);
                    }
                    origin.savedCS = Number($('canvas_scale').value);
                }
                keysDown.control = true;
                break;
            case 'ArrowLeft':
                if (!currentLayer) return;

                use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                if (keysDown.d) {
                    use.pos.x--;
                    renderLayers();
                }
                break;
            
            case 'ArrowRight':
                if (!currentLayer) return;

                use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                if (keysDown.d) {
                    use.pos.x++;
                    renderLayers();
                }
                break;
            
            case 'ArrowDown':
                if (!currentLayer) return;

                use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                if (keysDown.d) {
                    use.pos.y++;
                    renderLayers();
                }
                break;
            
            case 'ArrowUp':
                if (!currentLayer) return;

                use = currentNumberVersion ? layers[currentLayer].sets[currentNumberVersion-1] : layers[currentLayer];
                if (keysDown.d) {
                    use.pos.y--;
                    renderLayers();
                }
                break;
            
        }
    }
    document.body.onkeyup = function(e) {
        switch(e.key) {
            case 's':
                keysDown.s = false;
                lockS = false;
                break;
            case 'd':
                keysDown.d = false;
                lockD = false;
                break;
            case 'Shift':
                keysDown.shift = false;
                break;
            case 'Control':
                lock2 = false;
                lockedDir = false;
                keysDown.control = false;
                break;
        }
    }
    
    //Control Events When The Mouse is Moved, like control d and s etc..
    document.onmousemove = function(e) {
        let use = currentLayer !== false ? layers[currentLayer] : false;
        if (currentNumberVersion) use = layers[currentLayer].sets[currentNumberVersion-1];
    
        //Control Canvas Scaling and Style Scaling
        if (keysDown.s && keysDown.control) {
            $('canvas_scale').value = origin.savedCS + ((e.pageX - origin.x)/5);
            runCanvasSizing();
        } else if(keysDown.s && currentLayer !== false) {
            if (use.type == 'text') {
                use.fontS = origin.savedFontS + ((e.pageX - origin.sizeX)/5);
            }
            if (use.type == 'image') {
                use.size = origin.savedSize + ((e.pageX - origin.sizeX)/5);
            }
            renderLayers();
        }
    
        if (keysDown.d && !keysDown.control && currentLayer !== false) {
            use.pos.x = Number(origin.d.savedx) + e.pageX - Number(origin.d.x);
            use.pos.y = Number(origin.d.savedy) + e.pageY - Number(origin.d.y);
            renderLayers();
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
                    use.pos.x = Number(origin.savedX);
                } else {
                    lockedDir = 'x';
                    use.pos.y = Number(origin.savedY);
                }
            }
            if (lockedDir == 'y') {
                use.pos.y = Number(origin.savedY) + e.pageY - Number(origin.y)
            } else {
                use.pos.x = Number(origin.savedX) + e.pageX - Number(origin.x);
            }
            renderLayers();
        }
    
        
        mouseSpeed = e.pageX - oldx;
        oldx = e.pageX;
        mouseSpeedY = e.pageY - oldy;
        oldy = e.pageY;
    }
}
//////////////////////////
//  End On Input Event  //
//////////////////////////


function closeImportMenu() {
    $('importMenu').hide();
    for (let i = 0; i < complete[0].length; i++) {
        $('i' + i).className = 'button';
        currentLabel = false;
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
            fontS: 20,
            fontLH: 20,
            fontTA: false,
            fontB: false,
            fontI: false,
            label: complete[0][currentLabel],

            sets: [{},{},{},{},{}],
        })
        currentLayer = layers.length - 1;
        $('controlSettings').show();
        $('tableText').show();
        $('tableImage').hide();
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }

    //Reset Label and Hide Import Menu
    closeImportMenu();
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
            label: complete[0][currentLabel],

            sets: [{},{},{},{},{}],
        })

        let htmlImg = $('allImages').create('img');
        htmlImg.num = currentLabel;
        htmlImg.onload = function() {
            allImages.push({
                src: this.num,
                htmlImg: this,
                switch: currentCreature,
            })
        }
        htmlImg.src = complete[currentCreature][currentLabel];

        currentLayer = layers.length - 1;
        $('controlSettings').show();
        $('tableText').hide();
        $('tableImage').show();
        renderLayers();
    } else {
        alert('No Labels Have Been Selected Yet')
    }

    //Reset Label and Hide Import Menu
    closeImportMenu();
}

function importSheet(txt2,sets) {
    let txt = txt2 ? txt2 : prompt('Paste Your Sheet:');
    if (!txt) return;

    //Clear All Pictures
    $('allImages').innerHTML = '';
    allImages = [];

    complete = txt;
    if (typeof(txt) !== 'object') {
        txt = (txt).replace(/\\/g,"/");
        let arr = txt.split('\n');
        txt = (txt).replace(/\\r/g,"");
        currentCreature = 1;
        complete = [];
        for (let i = 0; i < arr.length; i++) {
            complete.push(arr[i].split('	'));
        }
        for (let i = 0; i < complete.length - 1; i++) {
            let str = complete[i][complete[i].length - 1]; 
            complete[i][complete[i].length - 1] = str.replace(/(\r\n|\n|\r)/gm,"");
        }
    }

    let labels = $('labels').$('body');
    labels.innerHTML = '';
    for (let i = 0; i < complete[0].length; i++) {
        if (complete[0][i].toLowerCase() == 'template') {
            let tempImg = new Image();
            tempImg.onload = function() {
                card_width = this.naturalWidth;
                card_height = this.naturalHeight;
                $('canvas_width').value = card_width;
                $('canvas_height').value = card_height;
                sizeCanvas();
            }
            tempImg.src = complete[1][i];
        }
        let btn = labels.create('div');
        btn.innerHTML = complete[0][i];
        btn.i = i;
        btn.id = 'i' + i;
        btn.className = 'button'
        btn.onclick = function() {
            for (let k = 0; k < complete[0].length; k++) {
                $('i' + k).className = 'button'
            }
            currentLabel = this.i;
            this.className = 'buttonGold';

            //Open Import Menu Tab
            $('importMenu').show();
        };
    }
    let swtch = $('switch');
    swtch.innerHTML = '';
    
    //Find Where 'Label' Is located on 'Complete' (Speadsheet)
    let name, name2;
    for (let i = 0; i < complete.length; i++) {
        if (complete[0][i] == 'label') {
            name = i;
            break;
        }
        if (complete[0][i] == 'name') name2 = i;
    }
    if (!name) name = name2 ? name2 : 0;

    for (let i = 1; i < complete.length; i++) {
        let cont = swtch.create('div');
        let btn = cont.create('div');
        btn.innerHTML = complete[i][name];
        btn.i = i;
        btn.id = 'switchButton';
        btn.className = 'button'
        btn.check = false;
        if (i == 1) btn.className = 'buttonGold'
        btn.onclick = function() {
            for (let k = 0; k < document.querySelectorAll('#switchButton').length; k++) {
                document.querySelectorAll('#switchButton')[k].className = 'button'
            }
            this.className = 'buttonGold'
            currentCreature = this.i;
            drawCard();
        }

        //Create Buttons and Text 1-5
        for (let b = 1; b < 6; b++) {
            let check = cont.create('input');
            check.type = 'checkbox';
            check.className = 'switchNumber';
            check.id = appFormat(complete[i][name]) + b;
            check.family = complete[i][name];
            check.i = b;
            check.p = btn;
            if (sets) {
                if (sets[i-1] == b) {
                    check.checked = true;
                    btn.check = true;
                }
            }
            check.onclick = function() {
                this.p.check = this.i;
                for (let i = 1; i < 6; i++) {
                    if (this.i !== i) $(appFormat(this.family) + i).checked = false;
                }
                if (!this.checked) this.p.check = false;
                drawCard();
            }
            let a = cont.create('div');
            a.className = 'switchNumber';
            a.innerHTML = b;
        }
    }
    currentCreature = 1;
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
    if (currentLayer < 0) {
        currentLayer = 0;
        if (layers.length === 0) {
            $('controlSettings').hide();
        }
    }

    renderLayers();
}
function save() {
    download('Saved Layers File',JSON.stringify(layers));
}
//Tiles
//[{"name":"Profile","size":"190","pos":{"x":"60","y":"50"},"type":"image","src":12},{"name":"Template","size":"76","pos":{"x":0,"y":0},"type":"image","src":11},{"name":"Attack icon","size":"30","pos":{"x":"0465","y":"225"},"type":"image","src":15},{"name":"Life icon","size":"30","pos":{"x":"465","y":"40"},"type":"image","src":13},{"name":"Agility icon","size":"25","pos":{"x":"470","y":"130"},"type":"image","src":14},{"name":"XP icon","size":"30","pos":{"x":"465","y":"310"},"type":"image","src":16},{"name":"Gold icon","size":"30","pos":{"x":"465","y":"395"},"type":"image","src":17},{"name":"VP Icon","size":"30","pos":{"x":"465","y":"490"},"type":"image","src":18},{"name":"Life","size":100,"pos":{"x":"530","y":"105"},"type":"text","text":4,"fontC":"black","fontF":"Arial","fontS":"30","fontLH":"20","fontWW":"false","fontST":"italic","fontTA":true},{"name":"Agility","size":100,"pos":{"x":"530","y":"195"},"type":"text","text":6,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15,"fontTA":true},{"name":"Attack","size":100,"pos":{"x":"522","y":"288"},"type":"text","text":5,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"XP","size":100,"pos":{"x":"522","y":"378"},"type":"text","text":8,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Gold ","size":100,"pos":{"x":"522","y":"467"},"type":"text","text":7,"fontC":"black","fontF":"arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"VP","size":100,"pos":{"x":"522","y":"558"},"type":"text","text":9,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"italic","fontS":"30","fontLH":15},{"name":"Name","size":100,"pos":{"x":"45","y":"450"},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"23","fontLH":15},{"name":"Race","size":100,"pos":{"x":"275","y":"452"},"type":"text","text":1,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"22","fontLH":15},{"name":"State","size":100,"pos":{"x":"360","y":"452"},"type":"text","text":2,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"22","fontLH":15},{"name":"Text","size":100,"pos":{"x":"35","y":"475"},"type":"text","text":10,"fontC":"black","fontF":"Arial","fontWW":"400","fontST":"italic","fontS":"17","fontLH":"17","fontTA":false},{"name":"Ability","size":100,"pos":{"x":"35","y":"475"},"type":"text","text":19,"fontC":"black","fontF":"Arial","fontWW":"400","fontST":"normal","fontS":"17","fontLH":"18"},{"name":"Effect","size":100,"pos":{"x":"35","y":"455"},"type":"text","text":20,"fontC":"black","fontF":"Arial","fontWW":"520","fontST":"normal","fontS":20,"fontLH":"20"},{"name":"Name2","size":100,"pos":{"x":"50","y":"425"},"type":"text","text":21,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"23","fontLH":15}]
//Player Cards
//[{"name":"Portrait","size":270,"pos":{"x":74,"y":67},"type":"image","src":8},{"name":"Template","size":100,"pos":{"x":0,"y":0},"type":"image","src":7},{"name":"Name","size":"100","pos":{"x":743,"y":152},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"75","fontLH":15,"fontTA":false},{"name":"Text","size":100,"pos":{"x":639,"y":178},"type":"text","text":26,"fontC":"#6bd2fe","fontF":"Arial","fontWW":"950","fontST":"normal","fontS":"26","fontLH":"23","fontTA":false},{"name":"Life","size":100,"pos":{"x":"127","y":"677"},"type":"text","text":2,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"normal","fontS":"28","fontLH":"15","fontTA":true},{"name":"Attack","size":100,"pos":{"x":"280","y":677},"type":"text","text":3,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"Agility","size":100,"pos":{"x":"456","y":677},"type":"text","text":4,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"Items","size":100,"pos":{"x":"179","y":744},"type":"text","text":5,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"Strength","size":100,"pos":{"x":"402","y":746},"type":"text","text":6,"fontC":"#000000","fontF":"Arial","fontWW":"false","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"SN1","size":100,"pos":{"x":123,"y":818},"type":"text","text":9,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"SN2","size":100,"pos":{"x":352,"y":818},"type":"text","text":10,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"USN1","size":100,"pos":{"x":74,"y":818},"type":"text","text":11,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"USN2","size":100,"pos":{"x":266,"y":818},"type":"text","text":12,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"USN3","size":100,"pos":{"x":438,"y":818},"type":"text","text":13,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"SN1 stat","size":100,"pos":{"x":90,"y":821},"type":"text","text":14,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"SN2 stat","size":100,"pos":{"x":326,"y":821},"type":"text","text":15,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"USN1 stat","size":100,"pos":{"x":"55","y":818},"type":"text","text":16,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"USN2 stat","size":100,"pos":{"x":"238","y":818},"type":"text","text":17,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"USN3 stat","size":100,"pos":{"x":418,"y":818},"type":"text","text":18,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":true,"scale":"100"},{"name":"upgrade2","size":100,"pos":{"x":699,"y":698},"type":"text","text":19,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade3","size":100,"pos":{"x":699,"y":753},"type":"text","text":20,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade4","size":100,"pos":{"x":699,"y":812},"type":"text","text":21,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade5","size":100,"pos":{"x":988,"y":698},"type":"text","text":22,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade6","size":100,"pos":{"x":988,"y":"753"},"type":"text","text":23,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade7","size":100,"pos":{"x":"988","y":"812"},"type":"text","text":24,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"upgrade8","size":100,"pos":{"x":1301,"y":753},"type":"text","text":25,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"28","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Text Line B ","size":100,"pos":{"x":1133,"y":500},"type":"text","text":27,"fontC":"#6bd2fe","fontF":"Arial","fontWW":"950","fontST":"normal","fontS":"26","fontLH":"23","fontTA":false,"scale":"100"}]
//paste(String.raw`[{"name":"Portrait","size":244,"pos":{"x":87,"y":84},"type":"image","src":3},{"name":"Template","size":100,"pos":{"x":0,"y":0},"type":"image","src":2},{"name":"Name","size":100,"pos":{"x":108,"y":535},"type":"text","text":0,"fontC":"black","fontF":"Arial","fontWW":false,"fontST":"bold","fontS":"30","fontLH":15,"fontTA":false},{"name":"Gold icon","size":100,"pos":{"x":568,"y":200},"type":"image","src":10,"scale":"100","fontF":"Arial","fontST":"normal","fontWW":"","fontS":"35","fontC":"#000000","fontLH":"15"},{"name":"Cost","size":100,"pos":{"x":616,"y":386},"type":"text","text":4,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"35","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Sell","size":100,"pos":{"x":616,"y":434},"type":"text","text":5,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"35","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Attack/armor","size":100,"pos":{"x":155,"y":575},"type":"text","text":7,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Durability","size":100,"pos":{"x":154,"y":644},"type":"text","text":9,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Agility","size":100,"pos":{"x":345,"y":575},"type":"text","text":8,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Text\r","size":100,"pos":{"x":100,"y":681},"type":"text","text":11,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Strength","size":100,"pos":{"x":155,"y":608},"type":"text","text":6,"fontC":"#000000","fontF":"Arial","fontWW":"","fontST":"normal","fontS":"25","fontLH":"15","fontTA":false,"scale":"100"},{"name":"Shop\r","size":87,"pos":{"x":581,"y":58},"type":"image","src":12}]`)
function paste(strs) {
    let str = strs ? strs : prompt('Paste Your Layer String Below:');
    str = str.replaceAll(',}','}');
    str = str.replace(/(?:\r\n|\r|\n)/g, '');
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
        fontTA: $('s_fontta').checked,
        fontI: $('s_fonti').checked,
        fontB: $('s_fontb').checked,
    }
}
function pasteFormat() {
    if (!currentLayer) return;

    layers[currentLayer].scale = Number(copiedFormat.scale);
    layers[currentLayer].pos.x = Number(copiedFormat.x);
    layers[currentLayer].pos.y = Number(copiedFormat.y);
    layers[currentLayer].fontF = copiedFormat.fontFamily;
    layers[currentLayer].fontWW = copiedFormat.wordWrap;
    layers[currentLayer].fontS = Number(copiedFormat.fontSize);
    layers[currentLayer].fontC = copiedFormat.fontColor;
    layers[currentLayer].fontLH = Number(copiedFormat.lineHeight);
    layers[currentLayer].fontTA = copiedFormat.fontTA;
    layers[currentLayer].fontI = copiedFormat.fontI;
    layers[currentLayer].fontB = copiedFormat.fontB;
    renderLayers();
}


function askLayout() {
    if (complete.length === 0) {
        alert('Import A Sheet To Get Started')
        return;
    }

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


function saveCurrentSheet(run) {
    if (complete.length === 0) {
        alert('Import A Sheet To Get Started')
        return;
    }

    //Use Is Checkboxs on Creatures
    let use = [];
    for (let i = 1; i < complete.length; i++) {
        if ($(appFormat(complete[i][0]) + 1).length > 1) {
            let cnt = -1;
            for (let j = 0; j < i + 1; j++) {
                if (complete[i][0] === complete[j][0]) cnt++;
            }
            use.push($(appFormat(complete[i][0]) + 1)[cnt].p.check);
        } else {
            use.push($(appFormat(complete[i][0]) + 1).p.check);
        }
    }

    let name;
    if (currentSheet !== false && !run) {
        name = savedSheets[currentSheet][0];
        savedSheets[currentSheet] = [name,complete,JSON.stringify(layers),JSON.stringify(use)]
    } else {
        let name = prompt('Name Your Sheet');
        if (!name) return;
        $('sheetName').innerHTML = name;
        savedSheets.push([name,complete,JSON.stringify(layers),use]);
    }
    
    localStorage.setItem('sheets',JSON.stringify(savedSheets));
    
}
function openSheetsMenu() {
    $('sheetMenu').show();
    let body = $('sheetMenu').$('body');
    body.innerHTML = '';
    for (let i = 0; i < savedSheets.length; i++) {
        let a = body.create('div');
        a.id = 'sheet';
        a.className = currentSheetMenu === i ? 'sheetGold' : 'sheet';
        a.it = i;
        a.onclick = function() {
            currentSheetMenu = this.it;
            $('sheetMenu').$('footer2').show();
            if ($('sheet').length) {
                for (let p = 0; p < $('sheet').length; p++) {
                    $('sheet')[p].className = 'sheet';
                }
            }
            this.className = 'sheetGold';
        }

        //Text
        text = a.create('div');
        text.id = 'text';
        text.innerHTML = savedSheets[i][0];
        text.title = savedSheets[i][0];

        //Load
        ar = a.create('div');
        ar.innerHTML = 'Load';
        ar.id = 'load'
        ar.it = i;
        ar.sheet = savedSheets[i][1]
        ar.layer = savedSheets[i][2];
        ar.onclick = function() {
            let sets = savedSheets[this.it][3];
            if (typeof(sets) == 'string') sets = JSON.parse(sets);
            importSheet(this.sheet,sets);
            paste(this.layer)
            currentSheet = this.it;
            $('sheetName').innerHTML = savedSheets[this.it][0]
            closeSheetMenu();
        }
        ar.className = 'sheetoption';
        ar.css({
            float: 'left',
            display: 'inline-block',
        })
    }
}

//SheetMenuFunctions (EG Rename, Delete, Move Sheets etc)
function smRename() {
    let name = prompt('Name Your Sheet:')
    if (!name) return;
    savedSheets[currentSheetMenu][0] = name;
    localStorage.setItem('sheets',JSON.stringify(savedSheets))
    openSheetsMenu();
}
function smDelete() {
    savedSheets.splice(currentSheetMenu,1)
    localStorage.setItem('sheets',JSON.stringify(savedSheets))
    openSheetsMenu();
    currentSheetMenu = false;
    
    $('sheetMenu').$('footer2').hide();
}
function smMove(dir) {
    if (currentSheetMenu + dir < 0 && dir == -1) return;
    if (currentSheetMenu + dir > savedSheets.length - 1 && dir == 1) return;

    savedSheets = array_move(savedSheets,currentSheetMenu,currentSheetMenu+dir)

    localStorage.setItem('sheets',JSON.stringify(savedSheets))
    currentSheetMenu += dir;
    openSheetsMenu(currentSheetMenu+dir);
}

function closeSheetMenu() {
    $('sheetMenu').hide();
    currentSheetMenu = false;
    $('sheetMenu').$('footer2').hide();
}

function newSheet() {
    //Reset Everything
    currentCreature = false;
    currentLabel = false;
    currentLayer = false;
    currentNumberVersion = false;
    currentSheet = false;
    complete = [];
    layers = [];
    $('allImages').innerHTML = '';
    allImages = [];
    $('switch').innerHTML = '';
    $('labels').$('body').innerHTML = '';
    $('sheetName').innerHTML ='Untitled';
    $('controlSettings').hide();

    renderLayers();
}
function appFormat(str) {
    return str.replaceAll(' ','_').replaceAll('(','_').replaceAll(')','_');
}

function hardsave() {
    localStorage.setItem('hs',localStorage.getItem('sheets'))
}
function hardload() {
    let saved = localStorage.getItem('hs');
    localStorage.clear();
    localStorage.setItem('sheets',saved);
    localStorage.setItem('hs',saved);
    savedSheets = JSON.parse(localStorage.getItem('sheets'));
    openSheetsMenu();
}
function harddown() {
    download('Sheets Hard Save',localStorage.getItem('hs'));
}

