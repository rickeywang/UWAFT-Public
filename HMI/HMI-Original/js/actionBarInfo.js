/*
* Copyright 2010-2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function updateActionBar(signal,data) {
	var dataUnit = '';
	if(signal=='essSOC'){
		dataUnit='%';
	} else if (signal=='essTemp'){
		dataUnit='\u00B0'+'C';
	} else if (signal=='essAmp'){
		dataUnit='A';
	}else if (signal=='essVolt'){
		dataUnit='V';
	} 
	document.getElementById(signal).setCaption('<b>'+data+'</b> '+dataUnit);
}

//TODO: Automactically expire old data (i.e. clear out in 100ms or so)

function setActionImages(img) {
	document.getElementById('tabAction').setImage(img);
	document.getElementById('tabOverflowAction').setImage(img);
	document.getElementById('findAction').setImage(img);
	document.getElementById('actionOverflowAction').setImage(img);
}

function setTab(tab) {
	document.getElementById('myActionBar').setSelectedTab(tab);
}
  
