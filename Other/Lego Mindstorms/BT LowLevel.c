////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                            Simple Bluetooth "Raw" Data Messaging
//
// The NXT Bluecore module supports connects using the SPP (Serial Port Profile) defined in the Bluetooth
// protocol specifications. There may be occasion when it is desirable to connect the NXT to another
// Bluetooth device in a "raw" format where the end user application program has direct control over
// every byte transmitted and received via the Bluecore module. For example, connecting to a BT enabled
// GPS receiver or connecting to a BT enabled cell phone or PDA.
//
// This sample program contains a short program demonstrating raw access to the Bluetooth data stream.
//
// NOTE: Normally the data transmission uses a higher level protocol that LEGO has defined for sending
//       messages back and forth between NXT devices. This protocol is bypassed by this programs.
//
// There are only three functions and one variable that are needed to operate the NXT Blucecore in "raw"
//
// setBluetoothRawDataMode()     This function initiates Bluecore module to switch to "raw" mode.
//
// bBTRawMode                    Read only boolean variable that can be tested to confirm when Blucore
//                               has entered "raw" mode.
//
// nxtReadRawBluetooth(pData, nMaxBufferSize)
//                               Reads one or more "raw" bytes from Bluecore. Returned value is the
//                               number of bytes read.
//
// nxtWriteRawBluetooth(pData, nLength)
//                               Writes 'nLength' bytes in raw mode from buffer 'pData'
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

#pragma platform(NXT)

short nMsgXmit           = 0;
short nLastCharReceived  = 0;

const int kPacketSize = 8;  // Number of hex digits that can be displayed on one line

//
// Function and task prototypes
//
void checkBTLinkConnected();
task sendRawData();
task readRawData();

void sendStuff();

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                        Main Task
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

task main()
{

	//
	// Test Ability to Turn Bluetooth On or Off
	//
  checkBTLinkConnected();

	//
	// Initialize Bluecore to "raw data" mode. This will be automatically reset when application terminates
	//
	setBluetoothRawDataMode();
	while (!bBTRawMode)
	{
		// Wait for Bluecore to enter raw data mode
		wait1Msec(1);
	}

	//
	// Start separate tasks to read and write raw data over BT. The link operates in full-duplex mode.
	//
	eraseDisplay();
	bNxtLCDStatusDisplay = true; // Enable top status line display

	sendStuff();
	//StartTask(sendRawData);
	StartTask(readRawData);
	while (true)
	{
		//
		// Display progress results on the NXT LCD screen.
		//
		nxtDisplayBigStringAt(0, 31, "Xmit Rcv");
	  nxtDisplayBigStringAt(0, 15, "    %02X", nMsgXmit, nLastCharReceived & 0x00FF);
	  wait1Msec(100); // To reduce the screen flicker
	}
	return;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                        checkBTLinkConnected
//
// Utility function to check whether Bluetooth link is set up. It should be manually set up before
// launching this program. [You can also set it up within an application program; there's a separate
// sample program for this.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

void checkBTLinkConnected()
{
	if (nBTCurrentStreamIndex >= 0)
	  return;  // An existing Bluetooth connection is present.

	//
	// Not connected. Audible notification and LCD error display
	//
	eraseDisplay();
	nxtDisplayCenteredTextLine(3, "BT not");
	nxtDisplayCenteredTextLine(4, "Connected");
	wait1Msec(3000);
	StopAllTasks();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                        Send Raw Bluetooth Data
//
// Periodically send a bunch of raw bytes over BT. This sample program sends 4 bytes every 50 msec.
//
// Each block of 4 bytes that are sent are identical valued and the value is incremented by one after
// every block is sent.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

task sendRawData()
{
	const int kSendSize = 3;
	const int kMinTimeBetweenMsg = 50;
	static ubyte BytesToSend[kSendSize];
	long nLastSendTime = nPgmTime;
	long nSendBusy = 0;
	char nMsgXmit1='y', nMsgXmit2='o';

	while (true)
	{
		//
		// Delay between transmissions.
		//
		if ((nPgmTime - nLastSendTime) < kMinTimeBetweenMsg)
		{
			wait1Msec(2000);
			continue;
		}

		//
		// Delay if Bluecore is busy. This should never happen.
		//
		if (bBTBusy)
		{
			++nSendBusy;
			wait1Msec(2000);
			continue;
		}

		++nMsgXmit;
		nMsgXmit %= 256;
		memset(BytesToSend, nMsgXmit1, sizeof(BytesToSend));
		BytesToSend[2]= nMsgXmit2;
	  nxtWriteRawBluetooth(BytesToSend, sizeof(BytesToSend));
	  nLastSendTime = nPgmTime;
	}
	return;
}

void sendStuff()
{
	const int kMinTimeBetweenMsg = 50;
	long nLastSendTime = nPgmTime;
	long nSendBusy = 0;
	//char nMsgXmit[]={'h','e','l','l','o',',',' ','W','o','r','l','d','!',' ','f','r','o','m',' ','T','W','P',' ','v','i','a',' ','B','T'};
	char nMsgXmit[]={'S','1'};
	const int kSendSize = 2;
	static ubyte BytesToSend[kSendSize];

	for(int i=0;i<kSendSize;i++){
	  BytesToSend[i] = nMsgXmit[i]
	}

	  nxtWriteRawBluetooth(BytesToSend, sizeof(BytesToSend));
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                                        readRawData
//
// Infinite loop reading RAW data.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

task readRawData()
{
	const int kHexDigitsPerLine = 8;
	int nIndex = 0;
	ubyte BytesRead[kHexDigitsPerLine]; // Circular buffer of last bytes read.
	int nNumbBytesRead;
	string sTemp;
	string sString;

	while (true)
	{
	  //
	  // Loop continuously, reading one byte at a time. The interface will support larger reads.
	  //
	  nNumbBytesRead = nxtReadRawBluetooth(BytesRead[nIndex], 1);
	  if (nNumbBytesRead == 0)
	  {
	  	wait1Msec(10);
	  	continue;
	  }
	  nLastCharReceived = BytesRead[nIndex] & (short) 0x00FF;  // For the display function

	  //
	  // Display the last eight bytes read on the NXT LCD in hex format.
	  //
	  sString = "";
	  for (int i = 0; i < kPacketSize; ++i)
	  {
	  	StringFormat(sTemp, "%02X", BytesRead[(kHexDigitsPerLine - i + nIndex) % kHexDigitsPerLine] & (short) 0x00FF);
	  	sString += sTemp;
	  }
		nxtDisplayTextLine(2, "%16s", sString);

	  nIndex += nNumbBytesRead;
	  nIndex %= kHexDigitsPerLine;
	}
}
