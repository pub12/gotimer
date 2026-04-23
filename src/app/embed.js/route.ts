import { NextResponse } from "next/server";

const SCRIPT = `(function(){
  var handler = function(e){
    if (!e.data || e.data.source !== 'gotimer') return;
    if (e.data.type !== 'resize') return;
    var frames = document.getElementsByTagName('iframe');
    for (var i=0; i<frames.length; i++){
      var f = frames[i];
      if (f.contentWindow === e.source){
        f.style.height = e.data.height + 'px';
      }
    }
  };
  window.addEventListener('message', handler, false);
})();`;

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
