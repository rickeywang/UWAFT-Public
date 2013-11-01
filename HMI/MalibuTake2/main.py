import sgc
from sgc.locals import *

import pygame
from pygame.locals import *

import os
import sys
import time
import carserver   
import threading
import string
import random
import datetime

#           (~   || _  _   /~`|_  _ . _|_  _
#           _)|_|||(/_| |  \_,| |(_)|| |_)(_)\/
#                                            /    

global LCDW, LCDH, LOGFILE_LOCATION
LCDW = 768
LCDH = 1024
LOGFILE_LOCATION = '/tmp'

class pageInfoProvider(threading.Thread):
    pageList = ['ESS', 'HVAC', 'MABx', 'TM4', 'GM LE9', 'Brusa']
    carInfoDef = [
                [['SOC', 'GFD', 'LVBATT', 'IBAT', 'VBAT', 'BATTEMP'], ["%", "kOhm", 'V', 'A', 'V', "\xB0C"]],
                [['CABIN_TEMP', 'FAN_RPM'], ['Centigrade', 'RPM']],
                [['AAA', 'BBB', 'CCC', 'ASDF', 'GFD', 'IBAT'], ['danger!', 'brandon!', 'ahhh', 'A', 'Centigrade', 'V']],
                [['Front_Spd', 'Rear_Spd', 'Gen_Spd'], ['RPM', 'RPM', 'RPM']],
                [['AAA', 'BBB', 'CCC', 'ASDF', 'ESS_TEMP', 'IBAT'], ['danger!', 'brandon!', 'ahhh', 'A', 'Centigrade', 'V']]
                ]
 #   allData = [[['' for k in xrange(len(pageList))] for j in xrange(3)] for i in xrange(10)]
    dataLen = [len(carInfoDef[i][0]) for i in xrange(0, len(carInfoDef))]
    print dataLen
    activePage = 0
    stopThread = False
    
   # pause_updating = False
 #   updating_paused = False
    
    # Start the thread with HV_DATA info by default
    zmq_receiver = carserver.carInfo('HV Info', dataLen[activePage], 5555, carInfoDef[0][0], carInfoDef[0][1])
    zmq_receiver.daemon = True
    zmq_receiver.start()

    def run(self):
        while not self.stopThread:            
            # Timeout checker
            if(time.time() - self.zmq_receiver.startTime > ZMQ_TIMEOUT):
                self.zmq_receiver.timeoutHandler()
            
            time.sleep(ZMQ_TIMEOUT * 0.6)                    
    
    def setPage(self, newActivePage):
        if(self.activePage != newActivePage):
            oldactivePage = self.activePage
            self.activePage = newActivePage
            if(self.change_zmq()):
                print("[INFO]\t Switched the active page to " + str(self.activePage))
            else:
                self.activePage = oldactivePage
                notify.send(2, "Failed to refresh. Is carserver running?")
        else:
            print("[INFO]\t Already on the active page " + str(self.activePage))
    
    def getDataLen(self):
        return self.dataLen[self.activePage]
    
    def change_zmq(self):
        self.zmq_receiver.stopThread = True
        self.zmq_receiver.join(0.1)
        if (self.zmq_receiver.isAlive()):
            print "[WAIT]\t Thread " + self.zmq_receiver.name + " is still alive. Attempt to join() with extended time."
            self.zmq_receiver.join(0.8)
            if (self.zmq_receiver.isAlive()):
                print "[ERR]\t Failed to join() " + self.zmq_receiver.name + ". The socket thread is probably blocking. Please make sure carserver is transmitting. "
                return False
        
        if self.activePage == 0:
            self.zmq_receiver = carserver.carInfo('HV Info', self.dataLen[self.activePage], 5555, self.carInfoDef[0][0], self.carInfoDef[0][1])
        elif self.activePage == 1:
            self.zmq_receiver = carserver.carInfo('HVAC Response', self.dataLen[self.activePage], 5555, self.carInfoDef[1][0], self.carInfoDef[1][1])
        elif self.activePage == 2:
            self.zmq_receiver = carserver.carInfo('MABx Info', self.dataLen[self.activePage], 5555, self.carInfoDef[2][0], self.carInfoDef[2][1])
        elif self.activePage == 3:
            self.zmq_receiver = carserver.carInfo('TM4 Info', self.dataLen[self.activePage], 5555, self.carInfoDef[3][0], self.carInfoDef[3][1])
        elif self.activePage == 4:
            self.zmq_receiver = carserver.carInfo('MABx Info', self.dataLen[self.activePage], 5555, self.carInfoDef[4][0], self.carInfoDef[4][1])     
        elif self.activePage == 9:
            return True     
        else:
            print("[ERR]\t No page specified. Using default.")
            self.activePage = 0
            self.zmq_receiver = carserver.carInfo('HV Info', self.dataLen[self.activePage], 5555, self.carInfoDef[0][0], self.carInfoDef[0][1])
        
        self.zmq_receiver.daemon = True
        self.zmq_receiver.start()
        return True

class notificationMgr(threading.Thread):
    timeout = [5, 3, 5, 6, 5]
    msgQueue = [[time.time(), 0, 'startup', 0]]  # 0: Time Received // 1: Kind // 2: Text // 3: Time Displayed
    msgLastID = 1
    sendTime = [0 for x in xrange(4)]
    screen = pygame.display.set_mode([LCDW, LCDH])
    overlayActive = False
    OVERRIDE_LEVEL = 3  # Any message above level 3 (WARN) will be drawn over any current messge immediately
    
    logFile = open(os.path.join(LOGFILE_LOCATION, 'DarrenSharper_' + datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d') +  '.log'),'a+')
  #  logFile.write("time,kind,text"+"\n")

    def run(self):
        
        # Specialized set-up for the welcome message
        self.__draw(0)
        msgDrawn = True  # When this is true, the logo will NOT be drawn
        logoDrawn = False # This prevents infinite drawing of the logo
        
        self.msgQueue[0][2] = '' 
        msgActive = 0
        msgActivateTime = time.time() # Timeout counter
        msgOverride = False # When true, it will be displayed immediately
        
             
        while True:
      #      print self.msgQueue
            time.sleep(0.1)
            try:
               # print len(self.msgQueue)
                for i in xrange(self.msgLastID, len(self.msgQueue)):
               #     print 'it is ' + str(i) + str(self.msgQueue[i])
                    if (self.msgQueue[i][1] >= self.OVERRIDE_LEVEL):
                        msgOverride = True
                        msgActive = i
                        msgActivateTime = time.time()
                        break
                    elif (self.msgQueue[i][1] > 0) and not msgDrawn:
                        msgActive = i
                        msgActivateTime = time.time()
                        break                 
                       # msgActivateTime = self.timeout[int(self.msgQueue[i][1])]
                   #     self.msgQueue[i][3] += self.timeout[self.msgQueue[i][1]]
            except ValueError:
                continue                            

            if (msgActive == 0) and (not msgDrawn) and (not logoDrawn):
                self.__draw(0)
                logoDrawn = True
            elif msgActive != 0 and (msgOverride or not msgDrawn):
                self.__draw(msgActive)
                msgDrawn = True
                msgOverride = False
                self.msgLastID = msgActive + 1
                #print 'next one will start at ' + str(self.msgLastID)
            elif msgDrawn:
                if (time.time() - msgActivateTime > self.timeout[int(self.msgQueue[msgActive][1])]):
                    msgActive = 0
                    msgDrawn = False
                    logoDrawn = False

    
    def send(self, kind, text=""):
#         currentID = 1
#         print currentID
        self.msgQueue.append([time.time(), kind, text, 0])
        self.logFile.write("\""+datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H%M%S') +"\"," + str(kind) +",\""+ text+"\"\n")
        self.logFile.flush()
        os.fsync(self.logFile.fileno())
#         self.msgQueue[1][currentID] = kind
#         self.msgQueue[2][currentID] = text
#         self.msgQueue[3][currentID] = 0
        
#         self.msgLastID += 1
        
      #  print self.msgQueue
      
    def msgProps(self, msgID):
        kind = self.msgQueue[msgID][1]
        
        if kind == -1:
            return [-1, (190, 190, 190), 'LOG']
        elif kind == 1:
            return [1, (0, 0, 190), 'INFO']
        elif kind == 2:
            return [2, (200, 0, 0), 'WARNING']
        elif kind == 3:
            return 'DANGER'
    
    def __draw(self, msgID):
        
        print '[INFO]\t Now displaying message ID: ' + str(msgID)
        
        kind = self.msgQueue[msgID][1]
        text = self.msgQueue[msgID][2]
        
        if kind == 0:  # Shows logo. We check if all notifications are timed out before display the logo
            if (text == 'startup'):
                # Welcome message
                pygame.draw.rect(self.screen, (0, 0, 0), (0, 0, LCDW, 60), 0)
                uwaftlogo = pygame.image.load(os.path.join('res', 'bonjour.png'))
                uwaftlogoPos = uwaftlogo.get_rect()
                uwaftlogoPos.centerx = background.get_rect().centerx
                uwaftlogoPos.centery = 60 / 2  # top bar is 60px high
                screen.blit(uwaftlogo, uwaftlogoPos)
            else:
                pygame.draw.rect(self.screen, (0, 0, 0), (0, 0, LCDW, 60), 0)
                uwaftlogo = pygame.image.load(os.path.join('res', 'uwaftic.png'))
                uwaftlogoPos = uwaftlogo.get_rect()
                uwaftlogoPos.centerx = background.get_rect().centerx
                uwaftlogoPos.centery = 60 / 2  # top bar is 60px high
                screen.blit(uwaftlogo, uwaftlogoPos)
        elif kind == 1 or kind == 2 or kind == 3:
            # Drop down display / toast on top, auto-dismiss after a few seconds
            warnFont = pygame.font.Font(os.path.join('res', 'OSP-DIN.ttf'), 40)
            
            if kind == 1:
                pygame.draw.rect(self.screen, (0, 0, 180), (0, 0, LCDW, 60), 0)
                pygame.draw.rect(self.screen, (200, 200, 200), (0, 0, LCDW, 60), 10)
                warnTxt = warnFont.render(text, 1, (255, 255, 255))
            elif kind == 2:
                pygame.draw.rect(self.screen, (255, 162, 1), (0, 0, LCDW, 60), 0)
                pygame.draw.rect(self.screen, (255, 255, 255), (0, 0, LCDW, 60), 10)
                warnTxt = warnFont.render(text, 1, (0, 0, 0))
            elif kind == 3:
                pygame.draw.rect(self.screen, (180, 0, 0), (0, 0, LCDW, 60), 0)
                pygame.draw.rect(self.screen, (200, 200, 200), (0, 0, LCDW, 60), 10)
                warnTxt = warnFont.render(text, 1, (255, 255, 255))
            
            
            warnTxtPos = warnTxt.get_rect(centerx=LCDW / 2, centery=30)
            screen.blit(warnTxt, warnTxtPos)
            
            self.sendTime[kind] = time.time()
        elif kind == 4:
            # pop-up window with forced dismiss
            self.overlayActive = True
            self.OverlayText = text
            print '[INFO]\t Full-screen notification: screen updating paused'

    def timeoutHandler(self, kind):
        if kind <= 2:
            self.send(0)


def test_btn0():
    pageInfo.setPage(0)

def test_btn1():
    pageInfo.setPage(1)
    
def test_btn2():
    pageInfo.setPage(2)
    
def test_btn3():
   pageInfo.setPage(3)
  
    
def random_string_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))
    
def test_btn4():
    notify.send(random.randrange(1, 3), random_string_generator() + " This car is exploting. Get out.")
    
def test_btn5():
  notify.send(3, random_string_generator() + " This overrides others")

def dismiss_overlay():
    print '[INFO]\t Overlay dismissed'
    notify.overlayActive = False
    notify.send(0)
    
def main():
    # Global variables & constants
    global ZMQ_TIMEOUT
    ZMQ_TIMEOUT = 2.4
    
    # Start information provider
    global pageInfo
    pageInfo = pageInfoProvider()
    pageInfo.daemon = True
    pageInfo.start()
    # Start MABx message receiver
#     mabxMsg = carserver.carInfo('MABx Messages', 1, 99999,['Code'],[''])
#     mabxMsg.daemon = True
#     mabxMsg.start()  

    # Pygame surfaces
    global screen
    screen = sgc.surface.Screen((LCDW, LCDH))
    clock = pygame.time.Clock()
    
    # Fill background
    global background
    background = pygame.Surface(screen.get_size())
    background = background.convert()
    background.fill((20, 25, 25))
    
    # Start threads that depend on Pygame
    # Homebrew notification manager
    global notify
    notify = notificationMgr()
    notify.daemon = True
    # Air conditioning manager
    global hvac
    hvac = carserver.hvacMgr('hvac', 5556)
    hvac.daemon = True
    hvac.start()
    
    # Text data is handled by the page thing
    infoFont = pygame.font.Font(os.path.join('res', 'Ticketing.otf'), 42)
    
    # Put on the button row
    btnFont = pygame.font.Font(os.path.join('res', 'OSP-DIN.ttf'), 28)
    acbtnFont = pygame.font.Font(os.path.join('res', 'OSP-DIN.ttf'), 22)
    btnLabel = ['ESS', 'HVAC', 'MABx', 'TM4', 'Top Bar test', 'Override Msg']
    btnPos = [25, LCDH - 80]
    
    # Painstakingly defining each button
    i = 0
    btn0 = sgc.Button(label=btnLabel[i], pos=(btnPos[0], btnPos[1]), col=(225, 128, 0), label_font=(btnFont))
    btn0.on_click = test_btn0
     
    i += 1
    btnPos[0] += 120
    btn1 = sgc.Button(label=btnLabel[i], pos=(btnPos[0], btnPos[1]), col=(107, 28, 214), label_font=(btnFont))
    btn1.on_click = test_btn1
     
    i += 1
    btnPos[0] += 120
    btn2 = sgc.Button(label=btnLabel[i], pos=(btnPos[0], btnPos[1]), col=(0, 180, 0), label_font=(btnFont))
    btn2.on_click = test_btn2
     
    i += 1
    btnPos[0] += 120
    btn3 = sgc.Button(label=btnLabel[i], pos=(btnPos[0], btnPos[1]), col=(0, 180, 0), label_font=(btnFont))
    btn3.on_click = test_btn3
 
    i += 1
    btnPos[0] += 120
    btn4 = sgc.Button(label=btnLabel[i], pos=(btnPos[0], btnPos[1]), col=(0, 180, 0), label_font=(btnFont))
    btn4.on_click = test_btn4
    
    i += 1
    btnPos[0] += 120
    btn5 = sgc.Button(label=btnLabel[i], pos=(btnPos[0], btnPos[1]), col=(0, 180, 0), label_font=(btnFont))
    btn5.on_click = test_btn5
    
    btnDismiss = sgc.Button(label="Dismiss", pos=(25, 405), col=(1, 1, 1), label_font=(btnFont))
    btnDismiss.on_click = dismiss_overlay
    
    acbtnPos = [25, 100]
    global acbtnOn
    acbtnOn = sgc.Switch(label="AC", pos=(acbtnPos[0], acbtnPos[1]), label_font=(acbtnFont), label_side="top")
    
    acbtnPos[0] += 140
    global acbtnTemp
    acbtnTemp = sgc.Scale(label="Temperature", pos=(acbtnPos[0], acbtnPos[1]), label_font=(acbtnFont), label_side="top", min=hvac.MIN_TEMP, max=hvac.MAX_TEMP)
    
    acbtnPos[0] += 260
    global acbtnFanSpd
    acbtnFanSpd = sgc.Scale(label="Fan Speed", pos=(acbtnPos[0], acbtnPos[1]), label_font=(acbtnFont), label_side="top")
    
    acbtnPos = [25, 180]
    global acbtnRecirc
    acbtnRecirc = sgc.Switch(label="Recirc", pos=(acbtnPos[0], acbtnPos[1]), label_font=(acbtnFont), label_side="top")
    
    notify.start()  # Display the welcome message and start notification mgr
    showMenuButton = True
    showACButton = False
    pageInfo.setPage(0)
    notify.send(-1, 'MalibuTake2 main Pygame loop started')
    
    while True:
        sgctime = clock.tick(30)
    
        for event in pygame.event.get():
            sgc.event(event)
            if event.type == GUI:
                print(event)
            if event.type == QUIT  or (event.type == KEYDOWN and event.key == K_ESCAPE):
                exit()
            if event.type == MOUSEBUTTONDOWN:
                if event.button == 1:
                    if event.pos[1] <= 60: # If click is in the top 60 pixels, go to message centre
                        pageInfo.setPage(9)

        # Button handlers
        if showMenuButton:
            btnDismiss.remove(1)
            btn0.add(0)
            btn1.add(0)
            btn2.add(0)
            btn3.add(0)
            btn4.add(0)
            btn5.add(0)
        elif not showMenuButton:
            btn0.remove(0)
            btn1.remove(0)
            btn2.remove(0)
            btn3.remove(0)
            btn4.remove(0)
            btn5.remove(0)
            
        if showACButton:
            hvac.pauseThread = False
            acbtnOn.add(0)
            acbtnTemp.add(0)
            acbtnFanSpd.add(0)
            acbtnRecirc.add(0)
        else:
            hvac.pauseThread = True
            acbtnOn.remove(0)
            acbtnTemp.remove(0)
            acbtnFanSpd.remove(0)
            acbtnRecirc.remove(0)
        
#         if pageInfo.activePage == 1:
#             afsd.add(0)
#         else:
#             asdf.remove(0)

        # Notifications are ran independently. Let's check on them:
        if notify.overlayActive:  # Overlay notification page
            showACButton = False
            showMenuButton = False     
            btn0.remove       
            dispScreen = pygame.display.set_mode([LCDW, LCDH])
            
            pygame.draw.rect(dispScreen, (200, 200, 200), (0, 0, LCDW, LCDH), 0)
            pygame.draw.rect(dispScreen, (200, 10, 10), (0, 0, LCDW, LCDH), 24)
            
            warnFont = pygame.font.Font(os.path.join('res', 'OSP-DIN.ttf'), 56)
            warnTxtPos = background.get_rect()
            warnTxtPos.left = 50
            warnTxtPos.centery = 320

            dispScreen.blit(warnFont.render(notify.OverlayText, 1, (180, 0, 0)), warnTxtPos)
            btnDismiss.add(0)
            
        elif pageInfo.activePage == 1:  # HVAC Page
            showACButton = True
            showMenuButton = True
            screen.blit(background, (0, 60))  # redraws background to cover everything up. 60 pixels top bar. 
            
            hvac.update([acbtnOn.state, acbtnTemp.value, acbtnFanSpd.value, acbtnRecirc.state])
         #   dispScreen = pygame.display.set_mode([LCDW,LCDH])
         
        elif pageInfo.activePage == 9:  # Message Centre
            showACButton = False
            showMenuButton = True
            
            screen.blit(background, (0, 60))  # redraws background to cover everything up. 60 pixels top bar. 
            thisLinePos = screen.get_rect()
            thisLinePos.top = 80
            thisLineColour = (190, 190, 190)
            thisLineKind = '?'
            
            msgListFont = pygame.font.Font(os.path.join('res', 'SourceSansPro-Regular.otf'), 24)
            
            listStart = len(notify.msgQueue) - 30
            if(listStart < 1): listStart = 1  # Anything above 0, because that's the logo 
            
            for i in xrange(listStart, len(notify.msgQueue)):
                
                kind = notify.msgQueue[i][1]
        
                if kind == -1:
                    thisLineColour = (190, 190, 190)
                    thisLineKind = 'LOG'
                elif kind == 1:
                    thisLineColour = (90, 90, 190)
                    thisLineKind = 'INFO'
                elif kind == 2:
                    thisLineColour = (255, 230, 82)
                    thisLineKind = 'CAUT'
                elif kind == 3:
                    thisLineColour = (200, 0, 0)
                    thisLineKind = 'WARN'
                
                thisLinePos.left = 25
                screen.blit(msgListFont.render(str(i), 1, thisLineColour), thisLinePos)
                thisLinePos.left += 30
                screen.blit(msgListFont.render(datetime.datetime.fromtimestamp(notify.msgQueue[i][0]).strftime('%H:%M:%S'), 1, thisLineColour), thisLinePos)
                thisLinePos.left += 90
                screen.blit(msgListFont.render(thisLineKind, 1, thisLineColour), thisLinePos)
                thisLinePos.left += 70
                screen.blit(msgListFont.render(notify.msgQueue[i][2], 1, thisLineColour), thisLinePos)
                thisLinePos.centery += 25
            
        else:  # Normal information page
            showACButton = False
            showMenuButton = True
            
            screen.blit(background, (0, 60))  # redraws background to cover everything up. 60 pixels top bar. 
            thisLinePos = screen.get_rect()
            thisLinePos.top = 80
            
#             print mabxMsg.data
#             print pageInfo.zmq_receiver.data
            
            for i in xrange(0, pageInfo.getDataLen()):
                thisLinePos.left = 25
                screen.blit(infoFont.render(str(pageInfo.zmq_receiver.data[0][i]), 1, (0, 144, 0)), thisLinePos)
                thisLinePos.left += LCDW * 0.3
                screen.blit(infoFont.render(str(pageInfo.zmq_receiver.data[1][i]), 1, (0, 222, 0)), thisLinePos)
                thisLinePos.left += LCDW * 0.4
                screen.blit(infoFont.render(str(pageInfo.zmq_receiver.data[2][i]), 1, (155, 155, 155)), thisLinePos)
                thisLinePos.centery += 50
            
        
        sgc.update(sgctime)
        pygame.display.flip()

if __name__ == "__main__":
    pygame.init()
    main()
    
    
