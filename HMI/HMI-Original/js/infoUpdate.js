/*
	This JS has all the scripts needed for the graphical gauges to work (justgage)
	
*/

console.log('infoupdate.js called');

//Gauges
var VehSpdAvgDrvn, g2, g3;
//Data Defs
var dataUnit = '', VehSpdAvgDrvn_data=0, g2_val=0, bar1_val=0;
//setInterval IDs
var gaugeRefresh, rdmgenn;


      
     function initGauge(){
        VehSpdAvgDrvn = new JustGage({
          id: "VehSpdAvgDrvn", 
          value: 55, 
          min: 0,
          max: 180,
          title: "Vehicle Speed",
          label: "Km/h"
        });
        
        g2 = new JustGage({
          id: "g2", 
          value: 32, 
          min: 50,
          max: 100,
          title: "Empty Tank",
          label: ""
        });
        
        g3 = new JustGage({
          id: "g3", 
          value: 120, 
          min: 50,
          max: 100,
          title: "Meltdown",
          label: ""
        });
		
		bar1 = document.getElementById('bar1');
		bar1.setState(bb.progress.NORMAL);
		bar1.setAttribute('max','100');
		
		console.log('justgage onload done');
     
		gaugeRefreshListener();
		startRANDOM();
		
      };
	  
	//The data timeout mechanism should be built in here also  
	function gaugeRefreshListener(){
		
		
		gaugeRefresh = setInterval(function() {
			VehSpdAvgDrvn.refresh(VehSpdAvgDrvn_data);
			g2.refresh(g2_val);
			bar1.setState(bb.progress.NORMAL);
			bar1.setValue(bar1_val);
        }, 50);
	}
	
	function startRANDOM(){
		console.log('startRANDOM');
	
		rdmgenn = setInterval(function() {
			VehSpdAvgDrvn_data=getRandomInt(11, 80);
			g2_val=getRandomInt(50, 200);
			bar1_val=getRandomInt(0, 100);
        }, 500);
	}
	
	  
	function updateSignal(signal,data) {
	
		console.log('updateSignal: signal '+signal+' data '+data);

		if(signal=='SysPwrMd'){
			dataUnit='';
		} else if (signal=='VehSpdAvgDrvn'){ //Refresh the gauge
			VehSpdAvgDrvn_data=data;
		} else if(signal=='essSOC'){
			dataUnit='%';
		} else if (signal=='essTemp'){
			dataUnit='\u00B0'+'C';
		} else if (signal=='essAmp'){
			dataUnit='A';
		}else if (signal=='essVolt'){
			dataUnit='V';
		} 
		
		console.log('RIC infoUpdate signal Updated');
	}
	
	function infoUpdate_onUnload() {
		//Get rid of all the setintervals
		window.clearInterval(gaugeRefresh);
		window.clearInterval(rdmgenn);
	
		console.log('infoupdate intervals clear');
	}
	
	