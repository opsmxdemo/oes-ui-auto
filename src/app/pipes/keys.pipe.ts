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

