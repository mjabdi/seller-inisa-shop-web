

const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
const arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]


function toFarsiNumber(n) {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  return n
    .toString()
    .split('')
    .map(x => farsiDigits[x])
    .join('');
}


const fixNumbers = (str) =>
{
  if(typeof str === 'string')
  {
    for (var j=0 ; j < 10 ; j++)
    {
        for(var i=0; i<10; i++)
        {
          str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }    
    }  
  }

  str = str.replace(/\D/g,'');
  return str;
}

const convertToPersian = (number) =>
{
  let numberStr = `${number}`
 
  for (var j=0 ; j < 10 ; j++)
  {
    for(var i=0; i<10; i++)
    {
      numberStr = numberStr.replace(`${i}`, persianNumbers[i])
    }
  }

  return numberStr.toString('utf-8')
}

module.exports = {
    fixNumbers : fixNumbers,
    convertToPersian : toFarsiNumber,
}