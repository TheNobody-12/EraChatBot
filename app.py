#imports
from flask  import Flask, render_template, request
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
# import libraries nltk , random , string,re,string,unicodedata,wikipedia,collections,warnings,sklearn
import nltk
import random
import string
import re, string, unicodedata
from nltk.corpus import wordnet as wn
from nltk.stem.wordnet import WordNetLemmatizer
import wikipedia as wk
from collections import defaultdict
import warnings
warnings.filterwarnings("ignore")
nltk.download('punkt') 
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, linear_kernel
app = Flask(__name__)

# create chatbot
englishBot = ChatBot("Chatterbot", storage_adapter="chatterbot.storage.SQLStorageAdapter")
trainer = ChatterBotCorpusTrainer(englishBot)
trainer.train("chatterbot.corpus.english") #train the chatter bot for english

# load  data
data = open('haus.txt','r',errors = 'ignore')
print("Loading  Custom Training data .. 100%")
raw = data.read()
raw = raw.lower()
# checking our data
raw[0:1000]
# converting all data into list of sentence
sent_tokens = nltk.sent_tokenize(raw)

#  using normalization. Doing word tokenization, Removing ASCII values, Removing tags of any kind, Part-of-speech tagging, and Lemmatization.
def Normalize(text):
    remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)
    #word tokenization
    word_token = nltk.word_tokenize(text.lower().translate(remove_punct_dict))
    
    #remove ascii
    new_words = []
    for word in word_token:
        new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
        new_words.append(new_word)
    
    #Remove tags
    rmv = []
    for w in new_words:
        text=re.sub("&lt;/?.*?&gt;","&lt;&gt;",w)
        rmv.append(text)
        
    #pos tagging and lemmatization
    tag_map = defaultdict(lambda : wn.NOUN)
    tag_map['J'] = wn.ADJ
    tag_map['V'] = wn.VERB
    tag_map['R'] = wn.ADV
    lmtzr = WordNetLemmatizer()
    lemma_list = []
    rmv = [i for i in rmv if i]
    for token, tag in nltk.pos_tag(rmv):
        lemma = lmtzr.lemmatize(token, tag_map[tag[0]])
        lemma_list.append(lemma)
    return lemma_list

# greetings
welcome_input = ("hello", "hi", "greetings", "sup", "what's up","hey",)
welcome_response = ["hi", "hey", "hi there", "hello", "I am glad! You are talking to me"]
def welcome(user_response):
    for word in user_response.split():
        if word.lower() in welcome_input:
            return random.choice(welcome_response)

def generateResponse(user_response):
    robo_response=''
    sent_tokens.append(user_response)
    TfidfVec = TfidfVectorizer(tokenizer=Normalize, stop_words='english')
    tfidf = TfidfVec.fit_transform(sent_tokens)
    vals = cosine_similarity(tfidf[-1], tfidf)
    # vals = linear_kernel(tfidf[-1], tfidf)
    idx=vals.argsort()[0][-2]
    flat = vals.flatten()
    flat.sort()
    req_tfidf = flat[-2]
    if(req_tfidf==0) or "tell me about"  in user_response:
        print("Checking Wikipedia")
        if user_response:
            robo_response = wikipedia_data(user_response)
            return robo_response
    else:
        robo_response = robo_response+sent_tokens[idx]
        return robo_response#wikipedia search
def wikipedia_data(input):
    reg_ex = re.search('tell me about (.*)', input)
    try:
        if reg_ex:
            topic = reg_ex.group(1)
            wiki = wk.summary(topic, sentences = 3)
            return wiki
    except Exception as e:
            print("No content has been found")

def mainloop(user_response):
    flag=True
    # print("My name is Chatterbot and I'm a chatbot. If you want to exit, type Bye!")
    while(flag==True):
        user_response = request.args.get('msg')
        user_response=user_response.lower()
        if(user_response not in ['bye','shutdown','exit', 'see you','quit']):
            if(user_response=='thanks' or user_response=='thank you' ):
                flag=False
                print("Chatterbot : You are welcome..")
            else:
                if(welcome(user_response)!=None):
                    res = "Chatterbot : "+welcome(user_response)
                else:
                    print("Chatterbot : ",end="")
                    res = generateResponse(user_response)
                    sent_tokens.remove(user_response)
        else:
            flag=False
            res = "Chatterbot : Bye!!! "
        return res

#define app routes
@app.route("/")
def index():
    return render_template("chatbot.html")

@app.route("/get")
#function for the bot response
def get_bot_response():
    user_response = request.args.get('msg')
    if str(mainloop(user_response)).capitalize() != "None":
        return str(mainloop(user_response)).capitalize()
    else:
        return  str(englishBot.get_response(user_response))

if __name__ == '__main__':
    app.debug = True
    app.run() 