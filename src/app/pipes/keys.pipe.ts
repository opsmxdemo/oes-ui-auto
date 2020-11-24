import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}

@Pipe({name: 'replaceLineBreaks'})
export class ReplaceLineBreaks implements PipeTransform {
  transform(value: string): string {
    if(value != undefined){
      value = value.replace(/DOCUMENT|@n|@r|\\n/g, '<br/>');
      return value.replace(/@t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    }    
  }
}

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe {
  transform(val, args) {
    if (args === undefined) {
      return val;
    }
    if(val != undefined){
      if (val.length > args) {
        return val.substring(0, args) + '...';
      } else {
        return val;
      }
    }    
  }
}

@Pipe({
  name: 'changetextcolor'
}) 
export class ChangetextcolorPipe {
  transform(value, args) {
    if (args === undefined) {
      return value;
    }
    if(value != undefined){
      for(var i=0;i<args.length;i++)
      {
      var regex = new RegExp(args[i], 'g');
      value = value.replace(regex, '<span class="high"> '+args[i]+'</span>');
      }
      return value
    }    
  }
}

@Pipe({
  name: 'changeTImestamptotime'
}) 
export class ChangeTImestamptotimePipe {
  transform(val) {
   var date
    return  date = new Date(val);
    
  }
}

@Pipe({
  name: 'roundOff'
}) 
export class RoundOff {
  transform(val) {
    var ans= Math.round(val);
    return ans
    
  }
}

@Pipe({
  name: 'millisecondsToMins'
}) 
export class MillisecondsToMins {
  transform(val) {
   var totalSecs = (val-val%1000)/1000;
   var Hours = (totalSecs-totalSecs%3600)/3600
   var remMinsSecs = totalSecs%3600
   var mins = (remMinsSecs-remMinsSecs%60)/60
   var remSecs = remMinsSecs%60;
   var hoursDisplay:any;
   var minsDisplay:any;
   var secDisplay:any;
   if(Hours==0)
   {
    hoursDisplay="00"
   }
   else if(Hours<10){
    hoursDisplay="0"+Hours
   }
   else{
    hoursDisplay=Hours
   }

   if(mins<10){
    minsDisplay = "0"+mins
   }
   else{
     minsDisplay=mins
   }
   
   if(remSecs<10){
    secDisplay = "0"+remSecs
   }
   else{
    secDisplay=remSecs
   }
   var final = hoursDisplay+":"+minsDisplay+":"+secDisplay
   return final
  }
}
