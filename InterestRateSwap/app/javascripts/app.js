/*
MIT License

Copyright (c) 2017 Arshdeep Bahga and Vijay Madisetti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Maintenance contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Maintenance abstraction. We will use this abstraction
 * later to create an instance of the Maintenance contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import interest_artifacts from '../../build/contracts/InterestRateSwap.json'

var interestRateSwap = contract(interest_artifacts);

var accounts;
var account;
var balance;
var ticketPrice;
var contractInstance;
var notion;
var fixedPrice;
var floatPrice;

function setStatus(message) {
  $("#status").html(message);
};

function setStatus1(message) {
  $("#status1").html(message);
};

function setStatus2(message) {
  $("#status2").html(message);
};

function refreshVars(){
  interestRateSwap.deployed().then(function(contractInstance) {
  contractInstance.partyA.call().then(
      function(partyA) {
        $("#cf_partyA").html(partyA);
        return contractInstance.partyB.call();
      }).then(
      function(partyB) {

        $("#cf_partyB").html(partyB);
        return contractInstance.notional.call();
      }).then(
      function(notional) {
        notion = notional.toNumber();
        console.log("notion :"+notion);
        $("#cf_notional").html(notional.toNumber());
        return contractInstance.fixedRate.call();
      }).then(
      function(fixedRate) {
        fixedPrice = fixedRate.toNumber();
        console.log("fixedRate :"+fixedPrice);
        $("#cf_fixedRate").html(fixedRate.toNumber());
        return contractInstance.floatingRateMargin.call();
      }).then(
      function(floatingRateMargin) {
        floatPrice = floatingRateMargin.toNumber();
        console.log("floatingRateMargin :"+floatPrice);
        $("#cf_floatingRateMargin").html(floatingRateMargin.toNumber());
        return contractInstance.schedul.call();
      }).then(
      function(schedul) {
        $("#cf_schedule").html(schedul.toNumber());
        return contractInstance.startTime.call();
      }).then(
      function(startTime) {
        $("#cf_startTime").html(startTime.toNumber());
        return contractInstance.timeToExpiry.call();
      }).then(
      function(timeToExpiry) {
        $("#cf_timeToExpiry").html(timeToExpiry.toNumber());
        return contractInstance.isActive.call();
      }).then(
      function(isActive) {
        if(isActive){
          $("#cf_isActive").html("True");
          }else{
          $("#cf_isActive").html("False");
        }
        return contractInstance.isExpired.call();
      }).then(
      function(isExpired) {
        var expired = isExpired.toString();
        console.log("inside if :"+expired);
        var boolVal = expired.substring(0.4);
        console.log("bool val :"+boolVal);
        if(expired.includes("true")){
          console.log("inside if :"+isExpired);
          $("#cf_isExpired").html("True");
        }else{
          console.log("inside else  :"+boolVal);
          $("#cf_isExpired").html("False");
        }
        return contractInstance.lastAmountPaid.call();
      }).then (function(lastAmountPaid) {
        $("#cf_lastAmountPaid").html(lastAmountPaid.toNumber());
        console.log("lastAmountPaid "+lastAmountPaid);


        setStatus("");
        setStatus1("");
        setStatus2("");
        refreshBalance();
      });
    });
}

function refreshBalance() {
  var balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]),
                            "ether").toFixed(5);
  $("#cb_balance").html(balance);
  $("#cb_balance2").html(balance);
  var balance1 = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]),
                              "ether").toFixed(5);
  $("#cb_balance1").html(balance1);
}

window.initialize = function() {
  var partyATradingAcct = $("#partyATradingAcct").val();
  var partyBTradingAcct = $("#partyBTradingAcct").val();
  var fixedRate = parseFloat($("#fixedRate").val());
  var floatingRateMargin = parseFloat($("#floatingRateMargin").val());
  var notional = parseFloat($("#notional").val());
  var schedul = parseFloat($("#schedul").val());
  var rateFeed = $("#rateFeed").val();
  var feedName = $("#feedName").val();
  var timeToExpiry = parseFloat($("#timeToExpiry").val());

  setStatus("Initiating transaction... (please wait)");
interestRateSwap.deployed().then(function(contractInstance) {
  contractInstance.initialize(partyATradingAcct, partyBTradingAcct,
          fixedRate, floatingRateMargin, notional, schedul, feedName,
          rateFeed, timeToExpiry,
          {from: web3.eth.accounts[0], gas: 2000000}).then(
          function() {
            refreshVars();
          });
        });
}

window.validate = function() {
  setStatus1("Initiating transaction... (please wait)");
  interestRateSwap.deployed().then(function(contractInstance) {
   contractInstance.validate({from: web3.eth.accounts[1],
                              gas: 2000000}).then(
          function() {
            refreshVars();
          });
        });
}

window.exercise = function() {
  setStatus2("Initiating transaction... (please wait)");
  interestRateSwap.deployed().then(function(contractInstance) {
    console.log("notion :"+notion);
      console.log("fixed :"+fixedPrice);
        console.log("float :"+floatPrice);
   contractInstance.exercise(notion,fixedPrice,floatPrice,{from: web3.eth.accounts[0],
                              gas: 4712003}).then(
          function() {
            refreshVars();
          });
        });
}

$( document ).ready(function(){
	if (typeof web3 !== 'undefined') {
	    console.warn("Using web3 detected from external source like AWS")

	  // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	   window.web3 = new Web3(new Web3.providers.HttpProvider("http://34.213.252.82:8000"));
	   console.log("Connectiong to localhost - if->"+window.web3);
	  	//window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	  } else {

	  //	window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	  	window.web3 = new Web3(new Web3.providers.HttpProvider("http://34.213.252.82:8000"));
	    console.log("Connected to localhost - else->"+window.web3);
	  }

	interestRateSwap.setProvider(window.web3.currentProvider);

	web3.eth.getAccounts(function(err, accs){
		if(err !=null){
			alert('There was an error fetching your accounts.');
			return;
		}
		if(accs.length == 0){
			alert("Coundn't get any accounts!");
			return;
		}

		console.log('No of accounts->'+accs.length);
		accounts = accs;
    console.log('account '+accounts[0])
    console.log('account '+accounts[1])
		account = accounts[0];
    interestRateSwap.deployed().then(function(contractInstance) {

    $("#cf_address").html(contractInstance.address);
    $("#cb_address").html(account);
    $("#cb_address1").html(accounts[1]);
    $("#cb_address2").html(account);
    $("#qrcode").html("<img src=\"https://chart.googleapis.com/chart?cht=qr&chs=350&chl="+
      contractInstance.address+"\" height=\"350\"/>");
    refreshVars();

	});
});
});
