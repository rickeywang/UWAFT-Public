<?php

//		(~   || _  _   /~`|_  _ . _|_  _
//		_)|_|||(/_| |  \_,| |(_)|| |_)(_)\/
//										 /
  
function uwaftAuthChk($user) {

	// Create connection
	$AuthCon = mysqli_connect("localhost", "user", "pass", "tbl");
	
	// Check connection
	if (mysqli_connect_errno())
	{
		die("Connect failed!" . mysqli_connect_error());
	}
 
	if($result = mysqli_query($AuthCon,"SELECT * FROM CASauthList WHERE userid='$user' LIMIT 1")){
		echo "<p>$user successfully looged in via CAS. Welcome!</p>";
		mysqli_close($AuthCon);
		return true;
	} else {
		mysqli_close($AuthCon);
		return false;
	}
	
	/*
	
	if (!$result) { // add this check.
		die('Invalid query: ' . mysql_error());
	}
	$num_rows = mysqli_num_rows($result);

	if ($num_rows > 0) {
		mysql_close($AuthCon);
		return true;
	}
	else {
		mysql_close($AuthCon);
		return false;
	}
	
	*/
 }