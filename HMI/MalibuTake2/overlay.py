import sgc
from sgc.locals import *

import pygame
from pygame.locals import *

import os
import time  
import threading

class notificationMgr(threading.Thread):
    from itertools import chain
    timeout=[0,5,5,0]
    sendTime=[0 for x in xrange(4)]
    screen = pygame.display.set_mode([800,480])
    warnFont = pygame.font.Font(os.path.join('res', 'OSP-DIN.ttf'), 40)
    
    def run(self):
        while True:
            for i in xrange(0,4):
                if(time.time() - self.sendTime[i] > self.timeout[i]) and (self.timeout[i] != 0) and (self.sendTime[i] != 0):
                        self.timeoutHandler(i)
                        self.sendTime[i] = 0
    
    def send(self,kind,text=""):    
        if kind == 0: #Shows logo
            pygame.draw.rect(self.screen, (0,0,0), (0,0,800,60), 0)
            uwaftlogo = pygame.image.load(os.path.join('res', 'uwaftic.png'))
            uwaftlogoPos = uwaftlogo.get_rect()
            uwaftlogoPos.centerx = background.get_rect().centerx
            uwaftlogoPos.centery = 60/2 #top bar is 60px high
            screen.blit(uwaftlogo,uwaftlogoPos)
        elif kind == 1 or kind ==2:
            #Drop down display / toast on top, auto-dismiss after 5 seconds
            if kind == 1:
                pygame.draw.rect(self.screen, (0,0,180), (0,0,800,60), 0)
            elif kind == 2:
                pygame.draw.rect(self.screen, (180,0,0), (0,0,800,60), 0)
            pygame.draw.rect(self.screen, (200,200,200), (0,0,800,60), 10)
            
            warnTxt = self.warnFont.render(text, 1, (255, 255, 255))
            warnTxtPos = warnTxt.get_rect(centerx=400,centery=30)
            screen.blit(warnTxt, warnTxtPos)
            
            self.sendTime[kind] = time.time()
        elif kind == 3:
            #pop-up window with forced dismiss
            pygame.draw.rect(self.screen, (80,80,80), (400,200,600,400), 0)
            pygame.draw.rect(self.screen, (200,200,200), (400,200,600,400), 10)
            
            warnTxt = self.warnFont.render(text, 1, (255, 255, 255))
            warnTxtPos = warnTxt.get_rect(centerx=400,centery=30)
            screen.blit(warnTxt, warnTxtPos)
            dia = sgc.Dialog(pos=(400,240),label=text,title="Attention!")


    def timeoutHandler(self, kind):
        if kind == 1 or kind == 2:
            self.send(0)

    def truncline(text, font, maxwidth):
            real=len(text)       
            stext=text           
            l=font.size(text)[0]
            cut=0
            a=0                  
            done=1
            old = None
            while l > maxwidth:
                a=a+1
                n=text.rsplit(None, a)[0]
                if stext == n:
                    cut += 1
                    stext= n[:-cut]
                else:
                    stext = n
                l=font.size(stext)[0]
                real=len(stext)               
                done=0                        
            return real, done, stext             
            
    def wrapline(text, font, maxwidth): 
        done=0                      
        wrapped=[]                  
                                   
        while not done:             
            nl, done, stext=truncline(text, font, maxwidth) 
            wrapped.append(stext.strip())                  
            text=text[nl:]                                 
        return wrapped