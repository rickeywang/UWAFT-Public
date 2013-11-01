import zmq
import time
import threading

context = zmq.Context()

class carInfo(threading.Thread):
    data_length = 0
    dataPort = 0

    socket = context.socket(zmq.SUB)
    data = [[] for i in xrange(3)]
    startTime = 0.001
    stopThread = False
    
    def __init__(self, processName, length, port, dataPrefix=[''], dataSuffix=['']):
        threading.Thread.__init__(self)
        self.name = processName
        self.data_length = length
        self.data[0] = dataPrefix
        self.data[1] = ['No Signal']*self.data_length
        self.data[2] = dataSuffix
        self.dataPort = port
        
        print "[NEW]\t New carInfo object: " + str(self.data)
        
    def __del__(self):
        print("[DELETED]\t carInfo object " + self.name)
        
    def updateSocketOption(self, topic):
        self.socket.setsockopt(zmq.SUBSCRIBE, topic)
#        print("New topic set as " + str(topic))
    
    def run(self):
        # Set up ZMQ
        self.socket.connect("tcp://localhost:%s" % self.dataPort)
        self.updateSocketOption('')
        print("[NEW]\t ZMQ socket at " + str(self.dataPort) + " initialised for " + self.name)
       
        while (not self.stopThread):
            if (not self.stopThread):
                self.startTime = time.time()
                receiving_buf = self.socket.recv()
            try:
                dataIndex = self.data[0].index(receiving_buf.split(" ")[0])
                self.data[1][dataIndex] = receiving_buf.split(" ")[1]
            except ValueError:
                continue
             
    def timeoutHandler(self):
        for i in range(0,self.data_length):
            self.data[1][i] = "Timeout"


class hvacMgr(threading.Thread):
    socket = context.socket(zmq.REQ)
    dataPort = 0
    acTemp = 20
    cabinTemp = 20
    fanSpd = 0
    recirc = False
    acOn = False
    MIN_TEMP = 15
    MAX_TEMP = 26
    stopThread = False
    pauseThread = False
    lastUpdateTime = 0
    MIN_UPDATE_INTERVAL = 1
    status = ["Initializing","Initializing"]
    
    def __init__(self, processName, port):
        threading.Thread.__init__(self)
        self.name = processName
        self.dataPort = port
        
        print "[NEW]\t New HVAC object: " + str(self.name)
        
    def __del__(self):
        print("[DELETED]\t HVAC object " + self.name)
    
    def run(self):
        self.socket.connect("tcp://localhost:%s" % self.dataPort)
        print "[START]\t HVAC object: " + str(self.name)
        
        while not self.stopThread:
            if(not self.pauseThread):
                time.sleep(self.MIN_UPDATE_INTERVAL * 8)
            else:
                time.sleep(3)
    
    def update(self, hvacUIValue):
        
        # Update the values and call ZMQ if and when the UI values have been changed
        if(time.time() - self.lastUpdateTime > self.MIN_UPDATE_INTERVAL) and ((self.acOn != hvacUIValue[0] ) or 
            (self.recirc != hvacUIValue[1]) or
            (self.acTemp != hvacUIValue[2]) or
            (self.fanSpd != hvacUIValue[3])):  
            
            print hvacUIValue
        
            #Set variables
            self.acOn = hvacUIValue[0]
            self.recirc = hvacUIValue[1]
            self.acTemp = hvacUIValue[2]
            self.fanSpd = hvacUIValue[3]
            
            #Send toggle command to server
            self.lastUpdateTime = time.time()
           # self.write2server()
        
    def write2server(self):
        print "[ZMQ]\t HVAC write2server sending"
        self.socket.send("HVAC_AC " + str(int(self.acOn)))
        self.socket.send("HVAC_RECIRC " + str(int(self.recirc)))
        self.socket.send("HVAC_TEMP_SET " + str(self.acTemp))
        self.socket.send("HVAC_FAN_SPEED " + str(self.fanSpd))
        
        req_result = self.socket.recv()
        print '[ZMQ]\t HVAC Request result: ' + req_result
        

            