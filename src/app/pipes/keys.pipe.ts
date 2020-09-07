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
    value = value.replace(/DOCUMENT|@n|@r|\\n/g, '<br/>');
    return value.replace(/@t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
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

    if (val.length > args) {
      return val.substring(0, args) + '...';
    } else {
      return val;
    }
  }
}

@Pipe({
  name: 'changetextcolor'
})
export class ChangetextcolorPipe {
  transform(val, args) {
    if (args === undefined) {
      return val;
    }
    for(var i=0;i<args.length;i++)
    {
    val = val.replace(args[i], '<span class="high">'+args[i]+'</span>');
    }
    return val
  }
}