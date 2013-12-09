function set_board_size(){
 var bs = document.getElementById('boardsize');
 if(bs)
 {
  dimension = parseInt(bs.value);
  board = new Array();
  board.length = dimension*dimension;
 }
}

function open_new_window(URL)
{
   NewWindow = window.open(URL,"_blank","toolbar=no,menubar=0,status=0,copyhistory=0,scrollbars=yes,resizable=1,location=0,Width=800,Height=600");
   NewWindow.location = URL;
}

function maketable(firsttime)
{
 var s = '<table id="gametable" width="100%">';
 var i, j;
 for(i=0; i<dimension; i++) // here? 1
 {
  s = s+'<tr>';
  for(j=0; j<dimension; j++)
  {
   s = s+'<td id="'+i+'_'+j+'" width="'+250/dimension+'px">*</td>';
  }
  s = s+'</tr>';
 }
 s = s+'</table>';
 if(firsttime)
 {
  document.writeln(s);
 } else {
  document.getElementById('board_div').innerHTML = s;
 }
}

function updatetable()
{
 var i, j;
 for(i=0; i<dimension; i++)  // here? 2
 {
  for(j=0; j<dimension; j++)
  {
   var c = board[i+j*dimension].toUpperCase();
   if(c=='Q') c = 'Qu';
   document.getElementById(i+'_'+j).innerHTML = c;
  }
 }
}

function rolldice()
{
 var i, j, k;
 if(dimension==5)
 {
  rolldice5();
  return;
 }
 var remaining = new Array();
 for(i=0; i<dimension*dimension; i++)
 {
  j = Math.floor(Math.random()*dice.length);
  var die = dice[j];
  j = Math.floor(Math.random()*6);
  var c = die.charAt(j);
  board[i] = c;
 }
}

function rolldice5()
{
 var i, j, k;
 var remaining = new Array();
 for(i=0; i<25; i++)
  remaining.push(i);
 var order = new Array();
 for(i=0; i<25; i++)
 {
  j = Math.floor(Math.random()*remaining.length);
  k = remaining.splice(j, 1);
  var die = dice[k];
  j = Math.floor(Math.random()*6);
  var c = die.charAt(j);
  board[i] = c;
 }
}

function defineboard()
{
 var b = document.getElementById('boarddef').value.toLowerCase();
 if(b.length==dimension*dimension)
 {
  var i, j, k=0;
  for(i=0; i<dimension; i++)
  {
   for(j=0; j<dimension; j++)
   {
    board[i+j*5] = b.charAt(k);
    k += 1;
   }
  }
  updatetable();
  if(timeremaining>0)
   clearTimeout(timervar);
  timeremaining = 0;
  document.getElementById('gametable').style.backgroundColor = "#00FF00";
  showsolution();
 }
}

function newgame()
{
 rolldice();
 maketable(false);
 updatetable();
 var tt = document.getElementById('totaltime');
 if(tt)
 {
  totaltime = parseInt(tt.value)*1000;
 }
 var sol = document.getElementById('solution');
 if(sol) sol.innerHTML = '';
 if(timeremaining>0)
  clearTimeout(timervar);
 timeremaining = totaltime;
 timervar = setTimeout("tick()", updatefrequency);
 document.getElementById('gametable').style.backgroundColor = "#FFFF00";
}

function newseededgame()
{
 seedstr = document.getElementById('seeddef').value;
 Math.seedrandom(seedstr);
 newgame();
}

function tick()
{
 timeremaining = timeremaining-updatefrequency;
 if(timeremaining<=0)
 {
  timeremaining = 0;
  document.getElementById('gametable').style.backgroundColor = "#FFAA00";
 } else
 {
  timervar = setTimeout('tick()', updatefrequency);
 }
 var t = Math.ceil(timeremaining/1000);
 document.getElementById('timeremaining').innerHTML = "Remaining time: "+t;
 var w = Math.floor(bar_width*timeremaining/totaltime);
 document.getElementById('bar_remaining').width = w;
 document.getElementById('bar_elapsed').width = bar_width-w;
}

function transform_word(word)
{
 var w = word.toUpperCase();
 return w.replace(/Q/g, 'Qu');
}

function showsolution()
{
 solve();
 var s = '<table width="100%">'
 var col = 0;
 var bgcolor = 0;
 var bgcolstr = "$aaaaff";
 for(var wl=25; wl>=3; wl--)
 {
  var numsolsatthiswl = 0;
  for(var i=0; i<solutions.length; i++)
  {
   if(solutions[i].length==wl)
   {
    var w = transform_word(solutions[i]);
    if(col==0)
     s += '<tr>'
    col = (col+1)%numsolutioncols;
    s += '<td style="background-color:'+bgcolstr+';">';
    //s += '<a class="nodec" href="http://www.lexic.us/definition-of/'+w+'" target="_blank">';
    s += '<a class="nodec" href="#" onClick="open_new_window('
    s += "'http://www.lexic.us/definition-of/"+w+"');"+'">';
    s += w;
    s += '</a></td>';
    if(col==0)
     s += '</tr>\n';
    numsolsatthiswl += 1;
   }
  }
  if(numsolsatthiswl>0)
  {
    bgcolor = (bgcolor+1)%2;
    if(bgcolor==0) bgcolstr="#aaaaff";
    else           bgcolstr="#8888cc";
  }
 }
 if(col>0)
  s += '</tr>';
 s += '</table>';
 document.getElementById('solution').innerHTML = s;
}

function solve()
{
 var minlength = parseInt(document.getElementById('minlength').value);
 solutions = new Array();
 for(var i=0; i<words.length; i++)
 {
  if(words[i].length>=minlength)
  {
   if(findword(words[i]))
   {
    solutions.push(words[i]);
   }
  }
 }
 updatetable();
}

function findword(word)
{
 if(word.length==0) return 0;
 var i, j;
 for(i=0; i<dimension; i++)
 {
  for(j=0; j<dimension; j++)
  {
   if(board[i+j*dimension]==word.charAt(0))
   {
    if(findsequence(word, i, j)) return 1;
   }
  }
 }
 return 0;
}

function safeboard(i, j)
{
 if((i<0) || (j<0) || (i>=dimension) || (j>=dimension)) return '*';
 return board[i+j*dimension];
}

function findsequence(seq, i, j)
{
 if(seq.length<=1) return 1;
 var s;
 s = board[i+j*dimension];
 board[i+j*dimension] = ' ';
 for(var u=-1; u<=1; u=u+1)
 {
  for(var v=-1; v<=1; v=v+1)
  {
   if(safeboard(i+u, j+v)==seq.charAt(1))
   {
    if(findsequence(seq.substr(1), i+u, j+v))
    {
     board[i+j*dimension] = s;
     return 1;
    }
   }
  }
 }
 board[i+j*dimension] = s;
 return 0;
}

dimension = 5;
bar_width = 368;
totaltime = 10*1000;
timeremaining = 0;
updatefrequency = 50;
timervar = null;
numsolutioncols = 4;

dice = new Array(
 "yqyswf",
 "sztllp",
 "xolrql",
 "hcthjt",
 "jkhhwf",
 "ioeoau",
 "qbrlpr",
 "ggnetn",
 "aaeouo",
 "eiaeao",
 "scywsj",
 "ioeuee",
 "aioeea",
 "cmhkzn",
 "hgbmgn",
 "ouoaei",
 "sysyfd",
 "mlgmcp",
 "uieeoo",
 "dbxvdy",
 "fnrddw",
 "oaaeeu",
 "vmrgzr",
 "dkxmpk",
 "bvtnts");

board = new Array();
board.length = dimension*dimension;