
var fs=require("fs");
var readline=require('readline');

var ASIAN_Countries= ["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India",
 "Indonesia", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia",
 "Nepal","Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic",
 "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"];

var firstJSON=fs.createWriteStream('firstJSON.json'); //creating firstJSON
firstJSON.readable=true;
firstJSON.writable=true;

var secondJSON=fs.createWriteStream('secondJSON.json'); //creating secondJSON
secondJSON.readable=true;
secondJSON.writable=true;

var readline=readline.createInterface({
    input:fs.createReadStream('Indicators.csv') //reading csv file
});


var countriesColumn,IndicatorNameColumn,yearColumn;
var coloumnamearray=[];//storing headings
var isHeader=true;
var maleAndFemaleValuesArray=[];//male and female
var total_Y=[];//total years
readline.on('line', function (line) { // starting of "on" function

  if(isHeader){//used to extract headers

    coloumnamearray=line.split(",");
    countriesColumn=coloumnamearray.indexOf("CountryName");
    IndicatorNameColumn=coloumnamearray.indexOf("IndicatorName");
    yearColumn=coloumnamearray.indexOf("Year");
    isHeader=false;
    }
  else{ //used to extract remaining values

      var totalValues=[];
      var regEX=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);    
      regEX.forEach(function(string){

      totalValues.push(string.replace(/['"]+/g, ''));
      });
    var object={};
    var object2={};
    for(var i=0;i<ASIAN_Countries.length;i++){  //extracting male and female values from 1960 to 2015

      if(totalValues[countriesColumn]===ASIAN_Countries[i]){

        if((totalValues[yearColumn]>=1960)&&(totalValues[yearColumn]<=2015)){

          if(totalValues[2].endsWith("male (years)")||(totalValues[2].endsWith("female (years)"))) {

            for(var j=0;j<coloumnamearray.length;j++){

              object[coloumnamearray[j]]=totalValues[j];
              //console.log(coloumnamearray[j]);
              //console.log(totalValues[j]);
            }
            maleAndFemaleValuesArray.push(object);
          }
        }
      }
    }//end of for loop
    for(var i=0;i<ASIAN_Countries.length;i++){  //extracting total values from 1960 to 2015

      if(totalValues[countriesColumn]===ASIAN_Countries[i]){

        if((totalValues[yearColumn]>=1960)&&(totalValues[yearColumn]<=2015)){

          if((totalValues[2].endsWith("total (years)"))){

           for(var j=0;j<coloumnamearray.length;j++){

            object2[coloumnamearray[j]]=totalValues[j];
              console.log(coloumnamearray[j]);
              console.log(totalValues[j]);
            }
            total_Y.push(object2);
          }
        }
      }
    }//end of for loop
  }//end of extracting values
}).on('close', () => {//end of "on" function and start of "close"
  var maleAndFemaleValuesArray1=[];//male female values
  for (var i=1960; i<2016; i++){

    var maleValues=0;
    var femaleValues=0;
    var m=0;var f=0;
    for(var k=0;k<maleAndFemaleValuesArray.length;k++){

      if(parseFloat(maleAndFemaleValuesArray[k].Year)===i){

        if(maleAndFemaleValuesArray[k].IndicatorName=="Life expectancy at birth, female (years)"){

          femaleValues=femaleValues+parseFloat(maleAndFemaleValuesArray[k].Value);
          f++;
        }
        else{
          maleValues=maleValues+parseFloat(maleAndFemaleValuesArray[k].Value);
          m++;
        }
      }
    }//end of for loop
    maleAndFemaleValuesArray1.push({"year":i,"female":parseFloat(femaleValues/f),"male":parseFloat(maleValues/m)});
  }//end of for loop

  firstJSON.write(JSON.stringify(maleAndFemaleValuesArray1));
  var total_V_Countries=[];//for total values of countries
  for (var i=0; i<ASIAN_Countries.length; i++){

    var C_Name=ASIAN_Countries[i];
    var value1=0;
    var value2=0;
    for (var k =0; k <total_Y.length; k++){

     if(C_Name===(total_Y[k].CountryName)){

        value1 +=parseFloat(total_Y[k].Value);
        value2++;
      }
    }//end of for loop
    total_V_Countries.push({"countryName":C_Name,"total":parseFloat(value1/value2)});
  } //end of for loop

  //sorting of total values(Ascending order)
  total_V_Countries.sort(function(object2, object3){

  	return object3.total-object2.total;
  });
  var total_V_C=[];
  for(var top5=0;top5<5;top5++){

  	total_V_C[top5]=total_V_Countries[top5];
  }//end of for loop
  secondJSON.write(JSON.stringify(total_V_C));
});//end of "close" function