/*
  Date: 2013 Dec 8
  Author: Cas Roberts

  Determine all english words found by starting
  at any letter and traversing adjacent letters.
  
  Let user pick words & check against list.
*/

function Boggle(){
	// kick off the boggle program
	function init(){
    	// roots hold the first letter node for the dictionary
    	var roots = new Array();
    
    	// build the dictionary of words
		var dictionary = new Array();
		$.get("boggle/words.txt", function(data) {
      		var items = data.split('\n');
  		});
  
		// Do a jQuery Ajax request for the text dictionary
$.get( "dict/dict.txt", function( txt ) {
    // Get an array of all the words
    var words = txt.split( "\n" );
 
    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for ( var i = 0; i < words.length; i++ ) {
        dict[ words[i] ] = true;
    }
   
    // The game would start after the dictionary was loaded
    // startGame();
});
 
// Takes in an array of letters and finds the longest
// possible word at the front of the letters
function findWord( letters ) {
    // Clone the array for manipulation
    var curLetters = letters.slice( 0 ), word = "";
   
    // Make sure the word is at least 3 letters long
    while ( curLetters.length > 2 ) {
        // Get a word out of the existing letters
        word = curLetters.join("");
   
        // And see if it's in the dictionary
        if ( dict[ word ] ) {
            // If it is, return that word
            return word;
        }
 
        // Otherwise remove another letter from the end
        curLetters.pop();
    }
}

    self.readfile("words.txt")
    unplayable = True
    
    # keep track of how many boards were tried
    newBoardstat = 0
    
    while unplayable:
      #holds a double array of tile objects
      self.grid = defaultdict(lambda : defaultdict(list))
      self.grid      = self.randomBoard()
    
      # list for all possible words on the board
      self.foundWords = []
    
      for i in range(5):
        for j in range(5):
          self.findWords("", i, j)
    
      # if there are not at least 10 possible words
      # create a different board
      if len(self.foundWords) > 10:
        unplayable = False
      else:
        newBoardstat += 1
        self.foundWords = []
        
    # put the list in alphabetical order    
    self.foundWords.sort()
    
    print "Tried %d" % newBoardstat + " board(s) before this one."
    
    # temporary, to see all possible words
    for i in self.foundWords:
      print i
    
    # create the board
    self.drawBoard(root)
    
  # method for reading in lines of a given filename  
  def readfile(self, filename):
    file = open(filename, 'r')
    # uppercase letters to standardize and strip newlines
    line = file.readline().upper().strip()
    while line:
        self.insert(line)
        line = file.readline().upper().strip()
    file.close()
    
  # insert a word into the dictionary  
  def insert(self, line):
    if not self.roots.has_key(line[0]):
      self.roots[line[0]] = TrieNode(line[0])
      #print "add "+self.roots[line[0]].letter+" to dictionary"
    #else:
      #print line[0]+" already exists in dictionary"
      
    self.insertWord(line[1:], self.roots[line[0]])
    
  # recursive method that inserts new word into trie tree  
  def insertWord(self, word, node):
    #each node has children nodes to build diff words
    #check if children nodes contain next letter
    if node.children.has_key(word[0]):
      nextChild = node.children.get(word[0])
    else:
      nextChild = TrieNode(word[0])
      #print "add "+nextChild.letter
      node.children[word[0]] = nextChild
      
    if len(word) == 1:
      nextChild.fullWord = True
    else:
      self.insertWord(word[1:], nextChild)
      
  # depth first search starting with cell (i, j)
  def findWords(self, prefix, row, col):
    prefix = prefix + self.grid[row][col].letter
    if row < 0 or col < 0 or row >= 5 or col >= 5:
      #system out of bounds
      return
    
    if self.grid[row][col].visited:
      #already visited, can't visit more than once
      return
    
    # tile is visited  
    self.grid[row][col].visited = True
    # grab root node for first letter
    node = self.roots[prefix[0]]
    
    if len(prefix) > 2:
      if not self.existinTree(prefix, node):
        self.grid[row][col].visited = False
        
      if self.isFullWord(prefix, node):
        if not prefix in self.foundWords:
          self.foundWords.append(prefix)
          
    for a in range(-1, 1):
      for b in range(-1, 1):
        nrow = row+a
        ncol = col+b
        if nrow >= 0 and ncol >= 0 and nrow < 5 and ncol < 5 and math.fabs(a) != math.fabs(b):
          self.findWords(prefix, nrow, ncol)
          
    self.grid[row][col].visited = False
    
  # check if a word exists in the tree
  def existinTree(self, prefix, node):
    ret = True
    if len(prefix) > 1:
      if prefix[1] in node.children:
        ret = self.existinTree(prefix[1:], node.children[prefix[1]])
      else:
        return False
  
    return ret
  
  # recursive method to search trie tree  
  def isFullWord(self, word, node):
    # if the length of the word is 0
    if len(word) == 1:
      # check if it's  complete word
      return node.fullWord
      
    if node.children.has_key(word[1]):
      send = node.children[word[1]]
      return self.isFullWord(word[1:], send)
    else:
      return False
      
  # contains instructions for drawing the boggle board  
  def drawBoard(self, root):
    self.world   = [-1, -1, 1, 1]
    self.bgcolor = '#ffffff'
    self.root    = root
    self.pad     = 25
    self._ALL    = 'all'
    WIDTH, HEIGHT = 400, 400
    
    root.bind("<Escape>", lambda _ : root.destroy())
    self.canvas = Canvas(root, 
        width = WIDTH, 
        height = HEIGHT, 
        bg = self.bgcolor,
        bd = 10,
      )
      
    self.clock = Countdown(180, self.canvas)
    self.root.title('Boggle')
    self.canvas.pack(fill=BOTH, expand=YES)
    self.paintgraphics()
    self.poll()
    
  def poll(self):
    self.redraw()
    self.root.after(1000,self.poll)

  def redraw(self):
    self.canvas.delete(self._ALL)
    self.clock.remaining -= 1
    self.clock.countdown()
    self.paintgraphics()

  # draw letters on the board
  def paintgraphics(self):
    # 25px padding from edges
    r, c = 30, 30
    for i in range(5):
      for j in range(5):
        # draw letter on the canvas
        self.canvas.create_text(r, c, 
            text=self.grid[i][j].letter, 
            anchor="w", 
            fill=self.grid[i][j].color, 
            activefill="red",
            font="Arial 35 bold",
        )
        #self.canvas.bind(self.grid[i][j], printit())

        # increment row
        r += 65
      # increment column outside first loop  
      c += 65
      # reset to first row
      r = 25

  def randomBoard(self):
    board    = defaultdict(lambda : defaultdict(list)) 
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    alpha    = 26
    boardl   = 25
    row, col = 0, 0
   
    while boardl > 0:
      r = random.randrange(alpha)
      a = alphabet[r]
      board[row][col] = Tile(a, row, col)
      alphabet = alphabet.replace(a, "")
      col += 1

      if col >= 5:
        col   = 0
        row  += 1
      
      alpha  -= 1
      boardl -= 1

    return board

def main():
  root= Tk()
  Boggle(root)
    
  if not _inidle:
    root.mainloop()

if __name__=='__main__':
  main()