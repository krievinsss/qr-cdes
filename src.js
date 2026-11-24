import QRCode from 'qrcode';
import './style.css';
const $ = id => document.getElementById(id);
let current = '', generation = 0;
const options = {width:1024,margin:4,errorCorrectionLevel:'M',color:{dark:'#000000',light:'#ffffff'}};
function reset(){current=''; $('qr').hidden=true; $('placeholder').hidden=false; $('png').disabled=$('svg').disabled=true; $('status').textContent='Augsta kvalitāte · 1024 × 1024 px';}
$('url').addEventListener('input',()=>{generation++;reset();$('error').textContent='';});
$('form').addEventListener('submit',async e=>{e.preventDefault(); const token=++generation; reset(); $('error').textContent=''; try {let value=$('url').value.trim(); if(!/^[a-z][a-z\d+.-]*:/i.test(value)) value='https://'+value; const url=new URL(value); if(!['http:','https:'].includes(url.protocol)||!url.hostname) throw new Error('invalid'); const canvas=document.createElement('canvas'); await QRCode.toCanvas(canvas,url.href,options); if(token!==generation)return; $('qr').width=canvas.width; $('qr').height=canvas.height; $('qr').getContext('2d').drawImage(canvas,0,0); current=url.href; $('qr').hidden=false; $('placeholder').hidden=true; $('png').disabled=$('svg').disabled=false; $('status').textContent='QR kods gatavs lejupielādei!'; } catch {if(token===generation)$('error').textContent='Ievadi derīgu, pietiekami īsu HTTP vai HTTPS saiti.';}});
function download(blob,name){const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);}
$('png').onclick=()=>{if(current)$('qr').toBlob(blob=>{if(blob)download(blob,'qr-code.png');});};
$('svg').onclick=async()=>{if(!current)return;try{const svg=await QRCode.toString(current,{...options,type:'svg'});download(new Blob([svg],{type:'image/svg+xml'}),'qr-code.svg');}catch{$('error').textContent='Neizdevās lejupielādēt SVG.';}};
