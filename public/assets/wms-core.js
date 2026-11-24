function S(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function ve(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let o=Number(t),a=Math.abs(o),e=o<0?"-":"",n=o.toLocaleString("vi-VN")+" \u20AB";if(a>=1e9){let r=(a/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:e+r,unit:"t\u1EF7 \u20AB",full:n}}else if(a>=1e6){let r=(a/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:e+r,unit:"tr \u20AB",full:n}}else return{val:e+a.toLocaleString("vi-VN"),unit:"\u20AB",full:n}}function sr(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let o=new Date(t);if(isNaN(o.getTime()))return String(t);let a=o.getFullYear(),e=String(o.getMonth()+1).padStart(2,"0"),n=String(o.getDate()).padStart(2,"0");return`${a}-${e}-${n}`}catch{return String(t)}}function z(t){if(!t)return"\u2014";try{let o=new Date(t);if(isNaN(o.getTime()))return String(t);let a=String(o.getDate()).padStart(2,"0"),e=String(o.getMonth()+1).padStart(2,"0"),n=o.getFullYear();return`${a}/${e}/${n}`}catch{return String(t)}}function L(t,o=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:o})}function m(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function ir(t,o=200){let a=null;return function(...e){a&&clearTimeout(a),a=setTimeout(()=>{t.apply(this,e)},o)}}var ke=class{cache=new Map;defaultTtl=3e4;async get(o,a=this.defaultTtl){let e=Date.now(),n=this.cache.get(o);if(n&&e-n.timestamp<a)return e-n.timestamp>1e4&&fetch(o).then(r=>r.json()).then(r=>{r.success&&this.cache.set(o,{timestamp:Date.now(),data:r})}).catch(()=>{}),n.data;try{let s=await(await fetch(o)).json();return s.success&&this.cache.set(o,{timestamp:e,data:s}),s}catch(r){return{success:!1,error:r instanceof Error?r.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(o,a){this.cache.clear();try{return await(await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json()}catch(e){return{success:!1,error:e instanceof Error?e.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(o){if(!o){this.cache.clear();return}for(let a of this.cache.keys())a.includes(o)&&this.cache.delete(a)}async getPoList(o,a="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(o)}&status=${encodeURIComponent(a)}`)}async getPoDetails(o){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(o)}`)}async getReceiptHistory(o){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(o)}`)}async getInventory(o){return this.get(`/api/wh/inventory?site=${encodeURIComponent(o)}`)}async submitManualReceipt(o){return this.post("/api/fnb/manual-receipt",o)}},lr=new ke;function K(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let o=window,a=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():"K001";return a==="ALL"||!a?"K001":a}function it(t){if(!t||t==="\u2014")return"\u2014";let o=String(t).trim(),a=o.match(/^(\d{4})-(\d{2})-(\d{2})/);if(a)return`${a[1]}-${a[2]}-${a[3]}`;try{let e=new Date(o);if(!isNaN(e.getTime())){let n=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${n}-${r}-${s}`}}catch{}return o.slice(0,10)}function P(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let o=new Date;o.setHours(0,0,0,0);let a=new Date(t);a.setHours(0,0,0,0);let e=Math.ceil((a.getTime()-o.getTime())/(1e3*60*60*24));return e<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(e)} ng\xE0y)</span>`:e===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':e<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${e} ng\xE0y)</span>`:e<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`}function mt(t){window.gFnbReceiptCurrentView=t;let o=document.getElementById("fnbReceiptTabBtnPo"),a=document.getElementById("fnbReceiptTabBtnHistory"),e=document.getElementById("fnbPoListView"),n=document.getElementById("fnbReceiptHistoryView");t==="po"?(o&&(o.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),e&&e.classList.remove("hidden"),n&&n.classList.add("hidden"),dt()):(a&&(a.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),n&&n.classList.remove("hidden"),e&&e.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function Tn(t){let o=t||K(),a=document.getElementById("fnbReceiptFilterSite");a&&(a.value=o);let n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(i=>i.code.toUpperCase()===o.toUpperCase()),r=n?n.ten||n.name:o,s=document.getElementById("fnbReceiptCurrentSiteBadge");s&&(s.textContent=r),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(o):await dt(o)}function Cn(t){Wt(t)}async function dt(t){let o=t||K(),a=document.getElementById("fnbPoStatusFilter"),e=a?a.value:"OPEN",n=document.getElementById("fnbPoSummaryText");try{n&&(n.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${o}...`);let s=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(o)}&status=${encodeURIComponent(e)}&no-cache=1`)).json();if(s.success&&s.data){window.gFnbPoList=s.data;let i=document.getElementById("fnbPoSearchInput")?.value||"";Wt(i);let l=(window.gFnbPoList||[]).filter(c=>c.status==="OPEN").length,d=document.getElementById("fnbReceiptBadgePendingCount");d&&(d.textContent=String(l))}else throw new Error(s.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(r){console.error("loadFnbPoList error:",r),n&&(n.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+r.message)}}function Wt(t=""){let o=document.getElementById("fnbPoTableBody"),a=document.getElementById("fnbPoMobileCards"),e=document.getElementById("fnbPoSummaryText"),n=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),r=(t||"").toLowerCase().trim(),s=window.gFnbPoList||[];n&&(s=s.filter(i=>{let l=(i.supplier_name||"").toLowerCase();return n==="siba"?l.includes("siba")||l.includes("b\u1EBFp trung t\xE2m")||l.includes("trung t\xE2m"):n==="baf"?l.includes("baf")||l.includes("th\u1ECBt"):n==="spice"?l.includes("gia v\u1ECB")||l.includes("\u0111\u01B0\u1EDDng")||l.includes("unilever")||l.includes("cholimex")||l.includes("mu\u1ED1i"):n==="veg"?l.includes("rau")||l.includes("\u0111\xE0 l\u1EA1t")||l.includes("c\u1EE7"):!0})),r&&(s=s.filter(i=>{let l=(i.po_number||"").toLowerCase(),d=(i.supplier_name||"").toLowerCase(),c=(i.supplier_code||"").toLowerCase();return l.includes(r)||d.includes(r)||c.includes(r)})),e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${s.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),o&&(s.length===0?o.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':o.innerHTML=s.map(i=>{let l=i.status==="OPEN",d=i.status==="COMPLETED",c=d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',h=(i.po_number||"").startsWith("50000")||!i.supplier_code||i.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',g=Number(i.total_amount)||0,y=Number(i.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${m(i.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${m(it(i.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${h}
                <span class="font-medium text-gray-900 dark:text-white">${m(i.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${i.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${m(i.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${i.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${y.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${g>0?Math.round(g).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${c}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${m(i.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${d?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${d?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),a&&(s.length===0?a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':a.innerHTML=s.map(i=>{let l=i.status==="COMPLETED",d=(i.po_number||"").startsWith("50000")||!i.supplier_code||i.supplier_name==="B\u1EBFp Trung T\xE2m Siba",c=Number(i.total_amount)||0,u=Number(i.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${d?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${d?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${m(i.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${m(i.po_number)} \u2022 ${m(it(i.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${l?"text-emerald-600":"text-amber-600"} block">${l?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${i.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${u.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${c>0?Math.round(c).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${m(i.po_number)}')" class="w-full py-2 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${l?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${l?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Le(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let a=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let e=a.data;if(!e.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let n=e[0],r=document.getElementById("receiptModalInvoice"),s=document.getElementById("receiptModalInvoiceDisplay"),i=document.getElementById("receiptModalSite"),l=document.getElementById("receiptModalSiteDisplay"),d=document.getElementById("receiptModalSupplier"),c=document.getElementById("receiptModalSupplierDisplay"),u=document.getElementById("receiptModalDate"),h=new Date().toISOString().slice(0,10);r&&(r.value=n.po_number),s&&(s.textContent=n.po_number),i&&(i.value=n.site),l&&(l.textContent=n.site),d&&(d.value=n.supplier_name),c&&(c.textContent=n.supplier_name),u&&(u.value=h);let g="L\xD4-"+h.replace(/-/g,"").slice(2),y=new Date;y.setFullYear(y.getFullYear()+1);let p=y.toISOString().slice(0,10);window.gReceiptLines=e.map(f=>{let x=(f.merch_category||"").toLowerCase(),w=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:f.po_item,item_code:f.item_code,item_name:f.item_name,merch_category:f.merch_category,unit:f.unit||"KG",unit_price:Number(f.unit_price)||0,order_qty:Number(f.order_qty)||0,actual_qty:Number(f.order_qty)||0,batch_code:g,exp_date:w?p:"",is_food:w,note:""}}),Se();let b=document.getElementById("createReceiptModal");b&&b.classList.remove("hidden")}catch(o){console.error("openPoReceiptModal error:",o),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Se(){let t=document.getElementById("receiptLinesTableBody"),o=document.getElementById("receiptLinesMobileCards"),a=document.getElementById("receiptModalLineCount"),e=document.getElementById("receiptModalTotalAmount"),n=window.gReceiptLines||[];a&&(a.textContent=String(n.length));let r=0;t&&(t.innerHTML=n.map((s,i)=>{let l=(s.actual_qty||0)*(s.unit_price||0);return r+=l,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${i+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${m(s.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${m(s.item_code)}</span>
              ${s.merch_category?`<span>\u2022</span><span>${m(s.merch_category)}</span>`:""}
              ${s.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${m(s.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(s.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${i}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${m(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${i}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${i}" value="${s.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${i}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${i}" class="mt-1">
                ${P(s.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${i}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${l>0?Math.round(l).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${m(s.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${i}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=n.map((s,i)=>{let l=(s.actual_qty||0)*(s.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${m(s.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${m(s.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${m(s.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${i+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(s.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${i}" class="num font-bold text-brand-600 dark:text-brand-400">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${s.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${i}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${m(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${i}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${i}" value="${s.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${i}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${i}" class="mt-1">
                ${P(s.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${m(s.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${i}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),e&&(e.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function En(t,o){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let a=parseFloat(o);window.gReceiptLines[t].actual_qty=isNaN(a)?0:a;let e=window.gReceiptLines[t],n=(e.actual_qty||0)*(e.unit_price||0),r=document.getElementById(`receiptLineTotal_${t}`);r&&(r.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let s=document.getElementById(`receiptLineTotalMob_${t}`);s&&(s.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let i=0;window.gReceiptLines.forEach(d=>{i+=(d.actual_qty||0)*(d.unit_price||0)});let l=document.getElementById("receiptModalTotalAmount");l&&(l.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function In(t,o){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=o)}function Mn(t,o){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=o;let a=document.getElementById(`receiptExpWarning_${t}`);a&&(a.innerHTML=P(o));let e=document.getElementById(`receiptExpWarningMob_${t}`);e&&(e.innerHTML=P(o)),window.lucide&&window.lucide.createIcons()}function $n(t,o){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let a=new Date;a.setMonth(a.getMonth()+o);let e=a.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=e;let n=document.getElementById(`receiptLineExpInput_${t}`);n&&(n.value=e);let r=document.getElementById(`receiptLineExpInputMob_${t}`);r&&(r.value=e);let s=document.getElementById(`receiptExpWarning_${t}`);s&&(s.innerHTML=P(e));let i=document.getElementById(`receiptExpWarningMob_${t}`);i&&(i.innerHTML=P(e)),window.lucide&&window.lucide.createIcons()}function _n(t,o){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=o)}function Te(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function Bn(){window.gFnbPoList&&window.gFnbPoList.length?Le(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function Hn(){let o=(window.gReceiptLines||[]).filter(h=>(h.actual_qty||0)>0);if(!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let a=new Date;a.setHours(0,0,0,0);let e=!1;for(let h of o)if(h.exp_date){let g=new Date(h.exp_date);if(g.setHours(0,0,0,0),g<=a){e=!0;break}}if(e&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let n=document.getElementById("receiptModalSite")?.value||K(),r=document.getElementById("receiptModalInvoice")?.value||"",s=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",l=document.getElementById("receiptModalNotes")?.value||"",d=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",c={site_code:n,receipt_date:s,supplier:i,invoice_no:r,notes:l,created_by:d,lines:o.map(h=>({item_code:h.item_code,qty:h.actual_qty,unit_price:h.unit_price,batch_code:(h.batch_code||"").trim(),exp_date:(h.exp_date||"").trim()||null,note:h.note||""}))},u=document.getElementById("btnSubmitReceipt");u&&(u.disabled=!0,u.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let g=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();if(!g.success)throw new Error(g.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${g.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${n} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Te(),await dt(n),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(n),mt("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(h){console.error("submitCreateReceipt error:",h),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+h.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),u&&(u.disabled=!1,u.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Nn(t){let o=t||K(),a=document.getElementById("fnbReceiptsTableBody"),e=document.getElementById("fnbReceiptsMobileCards");try{let r=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(o)}&no-cache=1`)).json();if(r.success&&r.data){let s=r.data.receipts||[],i=document.getElementById("fnbReceiptBadgeHistoryCount");i&&(i.textContent=String(s.length)),a&&(s.length?a.innerHTML=s.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${m(l.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${m(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${m(it(l.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${m(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${m(l.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${m(l.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):a.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${m(o)}.</td></tr>`),e&&(s.length?e.innerHTML=s.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${m(l.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${m(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${m(it(l.receipt_date))} \u2022 PO: ${m(l.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${m(l.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(n){console.error("loadFnbReceiptsHistory error:",n)}}async function Fn(t){try{typeof window.showLoading=="function"&&window.showLoading();let a=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let e=a.data.lines||[],n=document.getElementById("invDetailModal"),r=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");r&&(r.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),s&&(s.textContent=`${e.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let i=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL Nh\u1EADp</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[100px]">M\xE3 L\xF4 SX</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[110px]">H\u1EA1n D\xF9ng (EXP)</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${e.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${m(d.item_name||d.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${m(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${m(d.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${d.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${m(d.exp_date?String(d.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${m(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),n&&n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(o){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Rn(t){let o=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||K()||"K001",e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(b=>b.code.toUpperCase()===o.toUpperCase()),n=e?e.ten||e.name:o,r=n.startsWith(o)?n:`${o} - ${n}`,s=document.getElementById("manualReceiptSiteNameDisplay");s&&(s.textContent=r);let i=document.getElementById("manualReceiptSiteSelect");i&&(i.value=o);let l=document.getElementById("manualReceiptSiteBadge");l&&(l.textContent=o);let d=document.getElementById("manualReceiptDate");d&&(d.value=new Date().toISOString().slice(0,10));let c=document.getElementById("manualReceiptSupplier");c&&!c.value&&(c.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let u=document.getElementById("manualReceiptInvoiceNo");u&&(u.value="");let h=document.getElementById("manualReceiptNotes");h&&(h.value="");let g=document.getElementById("manualItemSearchInput");g&&(g.value="");let y=document.getElementById("manualItemCategorySelect");y&&(y.value=""),window.gManualReceiptLines=[],ft();let p=document.getElementById("modalManualReceipt");p&&p.classList.remove("hidden"),await St(o,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function Ce(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function Dn(t){let o=document.getElementById("manualReceiptSiteBadge");o&&(o.textContent=t),await St(t,window.gManualShowAllCatalog)}async function An(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let o=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await St(o,window.gManualShowAllCatalog)}async function St(t,o){let a=document.getElementById("manualCatalogListContainer");a&&(a.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let e=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${o?"&include_all=1":""}`,r=await(await fetch(e)).json();r.success&&r.data?window.gManualSiteCatalog=r.data.items||[]:window.gManualSiteCatalog=[],gt()}catch(e){console.error("loadManualCatalogItems error:",e),a&&(a.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${m(e.message)}</div>`)}}function gt(){let t=document.getElementById("manualCatalogListContainer"),o=document.getElementById("manualCatalogCountText"),a=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),e=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),n=window.gManualSiteCatalog||[];if(a&&(n=n.filter(r=>{let s=(r.code||r.sku||"").toLowerCase(),i=(r.name||"").toLowerCase();return s.includes(a)||i.includes(a)})),e&&(n=n.filter(r=>(r.nhom_hang||r.item_group||r.nganh_hang||"").toLowerCase().includes(e))),o&&(o.textContent=String(n.length)),!!t){if(!n.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${a?`v\u1EDBi t\u1EEB kh\xF3a "${m(a)}"`:""}.
      </div>
    `;return}t.innerHTML=n.map(r=>{let s=r.code||r.sku,i=(window.gManualReceiptLines||[]).find(c=>c.item_code===s),l=parseFloat(r.book_qty||0),d=parseFloat(r.unit_price||0);return`
      <div onclick="addManualReceiptItem('${s}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${i?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${m(r.name||s)}">
              ${m(r.name||s)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${m(r.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${m(s)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${l>0?"text-emerald-600":"text-gray-500"} font-mono">${l.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${d>0?Math.round(d).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${i?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${i.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function Pn(t){let o=(window.gManualSiteCatalog||[]).find(e=>(e.code||e.sku)===t);if(!o)return;let a=(window.gManualReceiptLines||[]).find(e=>e.item_code===t);if(a)a.qty=Math.round((a.qty+1)*100)/100;else{let n="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),r=new Date;r.setFullYear(r.getFullYear()+1);let s=r.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:o.code||o.sku,item_name:o.name||o.code,unit:o.unit||"Ph\u1EA7n",unit_price:parseFloat(o.unit_price||0),qty:1,batch_code:n,exp_date:s,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}ft(),gt()}function ft(){let t=document.getElementById("manualLinesEmptyState"),o=document.getElementById("manualLinesTableWrapper"),a=document.getElementById("manualLinesMobileCards"),e=document.getElementById("btnClearAllManualLines"),n=document.getElementById("manualLinesTableBody"),r=document.getElementById("manualSelectedCountText"),s=document.getElementById("manualSummaryTotalSkus"),i=document.getElementById("manualSummaryTotalQty"),l=document.getElementById("manualSummaryTotalAmount"),d=window.gManualReceiptLines||[];if(r&&(r.textContent=String(d.length)),s&&(s.textContent=d.length+" m\xE3"),!d.length){t&&t.classList.remove("hidden"),o&&(o.classList.add("hidden"),o.classList.remove("lg:block")),a&&(a.classList.add("hidden"),a.classList.remove("block")),e&&(e.classList.add("hidden"),e.classList.remove("flex")),i&&(i.textContent="0"),l&&(l.textContent="0 \u0111");return}t&&t.classList.add("hidden"),o&&(o.classList.remove("hidden"),o.classList.add("lg:block")),a&&(a.classList.remove("hidden"),a.classList.add("block")),e&&(e.classList.remove("hidden"),e.classList.add("flex"));let c=0,u=0;n&&(n.innerHTML=d.map((h,g)=>{let y=(h.qty||0)*(h.unit_price||0);return c+=h.qty||0,u+=y,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${g+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${m(h.item_name)}">
              ${m(h.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${m(h.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${m(h.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${h.qty}" 
                   oninput="onManualLineQtyChange(${g}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${h.unit_price}" 
                   oninput="onManualLinePriceChange(${g}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${g}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${y>0?Math.round(y).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${m(h.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${g}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${h.exp_date||""}" 
                   onchange="onManualLineExpChange(${g}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${m(h.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${g}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${g})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=d.map((h,g)=>{let y=(h.qty||0)*(h.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${g+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${m(h.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${m(h.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${g})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${m(h.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${h.qty}" 
                     oninput="onManualLineQtyChange(${g}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${h.unit_price}" 
                     oninput="onManualLinePriceChange(${g}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${y>0?Math.round(y).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${m(h.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${g}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${h.exp_date||""}" 
                   onchange="onManualLineExpChange(${g}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),i&&(i.textContent=c>0?Number.isInteger(c)?String(c):c.toFixed(1):"0"),l&&(l.textContent=u>0?Math.round(u).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function On(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let a=parseFloat(o);window.gManualReceiptLines[t].qty=isNaN(a)?0:a,Vt()}function jn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let a=parseFloat(o);window.gManualReceiptLines[t].unit_price=isNaN(a)?0:a,Vt()}function Vt(){let t=0,o=0;(window.gManualReceiptLines||[]).forEach((n,r)=>{let s=(n.qty||0)*(n.unit_price||0);t+=n.qty||0,o+=s;let i=document.getElementById(`manualLineTotal_${r}`);i&&(i.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let a=document.getElementById("manualSummaryTotalQty"),e=document.getElementById("manualSummaryTotalAmount");a&&(a.textContent=t.toFixed(1)),e&&(e.textContent=Math.round(o).toLocaleString("vi-VN")+" \u0111")}function Wn(t,o){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=o)}function Vn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=o;let a=document.getElementById(`manualLineExpWarning_${t}`);a&&(a.innerHTML=P(o),window.lucide&&window.lucide.createIcons())}function Kn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let a=new Date;a.setMonth(a.getMonth()+o);let e=a.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=e;let n=document.getElementById(`manualLineExpInput_${t}`);n&&(n.value=e);let r=document.getElementById(`manualLineExpWarning_${t}`);r&&(r.innerHTML=P(e),window.lucide&&window.lucide.createIcons())}function Xn(t,o){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=o)}function Ee(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),ft(),typeof gt=="function"&&gt(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(o.item_name||o.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function Ie(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let o=document.getElementById("confirmClearManualCountText");o&&(o.textContent=String(t.length));let a=document.getElementById("modalConfirmClearManualLines");a&&(a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function Me(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function qn(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],Me(),ft(),gt(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Un(){let o=(window.gManualReceiptLines||[]).filter(y=>(y.qty||0)>0);if(!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let a=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!a){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let e=new Date;e.setHours(0,0,0,0);let n=!1;for(let y of o)if(y.exp_date){let p=new Date(y.exp_date);if(p.setHours(0,0,0,0),p<=e){n=!0;break}}if(n&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let r=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",s=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",l=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",d=(document.getElementById("manualReceiptNotes")?.value||"").trim(),c=`[${i}] ${d}`.trim(),u=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",h={site_code:r,receipt_date:s,supplier:a,invoice_no:l,notes:c,created_by:u,lines:o.map(y=>({item_code:y.item_code,qty:y.qty,unit_price:y.unit_price,batch_code:(y.batch_code||"").trim(),exp_date:(y.exp_date||"").trim()||null,storage_loc:y.storage_loc||"K\u1EC7 B\u1EBFp",note:y.note||""}))},g=document.getElementById("btnSubmitManualReceipt");g&&(g.disabled=!0,g.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let p=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)})).json();if(!p.success)throw new Error(p.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${p.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${r} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Ce(),await dt(r),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(r),mt("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(y){console.error("submitManualReceipt error:",y),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+y.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),g&&(g.disabled=!1,g.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var k=window;k.gFnbReceiptCurrentView=k.gFnbReceiptCurrentView||"po";k.gFnbPoList=k.gFnbPoList||[];k.gReceiptLines=k.gReceiptLines||[];k.gManualReceiptLines=k.gManualReceiptLines||[];k.gManualSiteCatalog=k.gManualSiteCatalog||[];k.gManualShowAllCatalog=k.gManualShowAllCatalog||!1;k.getActiveFnbReceiptSite=K;k.formatReceiptDateYMD=it;k.getReceiptExpWarningHtml=P;k.switchFnbReceiptSubView=mt;k.loadFnbReceipts=Tn;k.onFnbPoSearchInput=Cn;k.loadFnbPoList=dt;k.renderFnbPoTable=Wt;k.openPoReceiptModal=Le;k.renderReceiptLinesTable=Se;k.onReceiptLineQtyChange=En;k.onReceiptLineBatchChange=In;k.onReceiptLineExpChange=Mn;k.setReceiptLineQuickExp=$n;k.onReceiptLineNoteChange=_n;k.closeCreateReceiptModal=Te;k.openCreateReceiptModal=Bn;k.submitCreateReceipt=Hn;k.loadFnbReceiptsHistory=Nn;k.viewReceiptDetail=Fn;k.openManualReceiptModal=Rn;k.closeManualReceiptModal=Ce;k.onManualReceiptSiteChange=Dn;k.toggleManualShowAllCatalog=An;k.loadManualCatalogItems=St;k.filterManualCatalogList=gt;k.addManualReceiptItem=Pn;k.renderManualReceiptLinesTable=ft;k.onManualLineQtyChange=On;k.onManualLinePriceChange=jn;k.updateManualTotals=Vt;k.onManualLineBatchChange=Wn;k.onManualLineExpChange=Vn;k.setManualLineQuickExp=Kn;k.onManualLineLocChange=Xn;k.removeManualReceiptLine=Ee;k.removeManualLine=Ee;k.confirmClearAllManualReceiptLines=Ie;k.clearAllManualReceiptLines=Ie;k.closeConfirmClearManualLinesModal=Me;k.executeClearAllManualReceiptLines=qn;k.submitManualReceipt=Un;function X(){let t=document.getElementById("globalBranchSelect")?.value,o=localStorage.getItem("orbit_user_site"),a=window,e=typeof a.App<"u"&&a.App.currentBranch?a.App.currentBranch.toUpperCase():null,n=document.getElementById("fnbWasteFilterSite")?.value,r=t||o||e||n||"K001";return(r==="ALL"||r==="all")&&(r="K001"),r.toUpperCase()}function $e(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let o=t.value||X(),a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(e=>e.code!=="ALL");if(a&&a.length){let e="";a.forEach(n=>{e+=`<option value="${n.code}" ${n.code.toUpperCase()===o.toUpperCase()?"selected":""}>${n.name}</option>`}),t.innerHTML=e,o&&Array.from(t.options).some(n=>n.value===o)&&(t.value=o)}}function ht(t){let o=document.getElementById("subtab-fnb-waste-stock"),a=document.getElementById("subtab-fnb-waste-history"),e=document.getElementById("fnbWasteSubViewStock"),n=document.getElementById("fnbWasteSubViewHistory");t==="history"?(o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),e&&e.classList.add("hidden"),n&&n.classList.remove("hidden")):(o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),e&&e.classList.remove("hidden"),n&&n.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function _e(t){let o=t||X(),a=document.getElementById("fnbWasteTableBody"),e=document.getElementById("fnbWasteMobileCards"),n=document.getElementById("fnbWasteBadgeHistoryCount");try{let s=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(o)}&no-cache=1`)).json();if(s.success&&s.data){let i=s.data.wastes||[];n&&(n.textContent=String(i.length)),a&&(i.length?a.innerHTML=i.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${m(l.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${m(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${m(String(l.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${m(l.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${m(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${m(l.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):a.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${m(o)}.</td></tr>`),e&&(i.length?e.innerHTML=i.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${m(l.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${m(l.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${m(String(l.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${m(l.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${m(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(r){console.error("loadFnbWasteHistory error:",r)}}async function Gn(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let a=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let e=a.data.lines||[],n=document.getElementById("invDetailModal"),r=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");r&&(r.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),s&&(s.textContent=`${e.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let i=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL H\u1EE7y</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">L\xFD Do Chi Ti\u1EBFt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${e.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${m(d.item_name||d.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${m(d.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${m(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${m(d.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),n&&n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(o){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Be(){let t=document.getElementById("fnbWasteNganhHangFilter"),o=document.getElementById("fnbWasteNhomHangFilter");if(!t||!o)return;let a=new Map;(window.gFnbWasteStockItems||[]).forEach(n=>{let r=(n.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),s=(n.nhom_hang||n.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();a.has(r)||a.set(r,new Set),a.get(r).add(s)}),window.gFnbWasteNganhMap=a;let e='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(a.keys()).sort().forEach(n=>{e+=`<option value="${m(n)}">${m(n)}</option>`}),t.innerHTML=e,t.value="",Kt("")}function Kt(t){let o=document.getElementById("fnbWasteNhomHangFilter");if(!o)return;let a=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(n=>a.add(n)):window.gFnbWasteNganhMap.forEach(n=>n.forEach(r=>a.add(r))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(a).sort().forEach(n=>{e+=`<option value="${m(n)}">${m(n)}</option>`}),o.innerHTML=e,o.value=""}function Qn(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";Kt(t),yt()}function zn(){yt()}function Jn(t){yt()}function Yn(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function yt(){let t=document.getElementById("fnbWasteStockTableBody"),o=document.getElementById("fnbWasteStockMobileCards"),a=document.getElementById("fnbWasteStockEmptyState"),e=document.getElementById("fnbWasteSummary"),n=document.getElementById("fnbWasteBadgeInStockCount"),r=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),i=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),l=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),d=window.gFnbWasteStockItems||[],c=document.getElementById("kpiWasteInStockCount"),u=document.getElementById("kpiWasteInStockVal");c&&(c.textContent=String(d.length));let h=0;if(d.forEach(p=>{h+=Number(p.total_value)||Number(p.book_qty)*Number(p.unit_price)||0}),u){let p=ve(h);u.innerHTML=`${p.val}<span class="kpi-unit">${p.unit}</span>`}n&&(n.textContent=String(d.length));let g=d.filter(p=>{if(i==="EXP"&&(p.days_remaining!==void 0?Number(p.days_remaining):999)>15&&!p.is_expired||r&&(p.nganh_hang||"").trim().toLowerCase()!==r||s&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==s)return!1;if(l){let b=(p.name||"").toLowerCase(),f=(p.code||"").toLowerCase();if(!b.includes(l)&&!f.includes(l))return!1}return!0});if(e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${g.length} / ${d.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),Xt(),!g.length){t&&(t.innerHTML=""),o&&(o.innerHTML=""),a&&a.classList.remove("hidden");return}a&&a.classList.add("hidden");let y=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=g.map((p,b)=>{let f=Number(p.book_qty)||0,x=Number(p.unit_price)||0,w=Number(p.total_value)||f*x,v=p.wasteQty||0,T=v*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${b+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${m(p.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${m(p.name||p.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${m(p.nganh_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${p.nhom_hang&&p.nhom_hang!==p.nganh_hang?`<span>\u2022</span><span>${m(p.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${m(p.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${f.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(w).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${f}" value="${v>0?v:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${m(p.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${m(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${y.map(E=>`<option value="${m(E)}" ${p.wasteReason===E?"selected":""}>${m(E)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${m(p.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${T>0?Math.round(T).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${m(p.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${m(p.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=g.map(p=>{let b=Number(p.book_qty)||0,f=Number(p.unit_price)||0,x=p.wasteQty||0,w=x*f;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${m(p.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${m(p.name||p.code)}</h4>
              <div class="text-xs text-gray-400">${m(p.nganh_hang||p.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${b.toFixed(1)} ${m(p.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(f).toLocaleString("vi-VN")} \u20AB / ${m(p.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${b.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${b}" value="${x>0?x:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${m(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${m(p.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${w>0?Math.round(w).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${m(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${y.map(v=>`<option value="${m(v)}" ${p.wasteReason===v?"selected":""}>${m(v)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function Zn(t,o){let a=(window.gFnbWasteStockItems||[]).find(l=>l.code===t);if(!a)return;let e=parseFloat(o),n=Number(a.book_qty)||0;isNaN(e)||e<0?a.wasteQty=0:e>n?(a.wasteQty=n,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${n})`)):a.wasteQty=e;let r=a.wasteQty*(Number(a.unit_price)||0),s=document.getElementById(`wasteLineTotal_${t}`);s&&(s.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let i=document.getElementById(`mobWasteLineTotal_${t}`);i&&(i.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),Xt()}function to(t,o){let a=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);a&&(a.wasteReason=o)}function eo(t,o){let a=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);a&&(a.wasteNote=o)}function Xt(){let t=window.gFnbWasteStockItems||[],o=0,a=0;t.forEach(i=>{i.wasteQty>0&&(o++,a+=i.wasteQty*(Number(i.unit_price)||0))});let e=document.getElementById("kpiWasteSelectedCount");e&&(e.textContent=String(o));let n=document.getElementById("kpiWasteTotalEstAmount");if(n)if(a>0){let i=ve(a);n.innerHTML=`${i.val}<span class="kpi-unit">${i.unit}</span>`}else n.textContent="0 \u20AB";let r=document.getElementById("btnSubmitDirectWaste"),s=document.getElementById("btnSubmitDirectWasteText");r&&(r.disabled=o===0),s&&(s.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${o})`)}async function no(){let o=(window.gFnbWasteStockItems||[]).filter(l=>(l.wasteQty||0)>0);if(!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let a=X(),e=new Date().toISOString().slice(0,10),n=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",r=0;o.forEach(l=>{r+=l.wasteQty*(Number(l.unit_price)||0)});let s={site_code:a,waste_date:e,reason:o.length===1?o[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:n,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${o.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:n,lines:o.map(l=>({item_code:l.code,qty:l.wasteQty,unit_price:Number(l.unit_price)||0,reason_detail:l.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:l.wasteNote||""}))},i=document.getElementById("btnSubmitDirectWaste");i&&(i.disabled=!0,i.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let d=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!d.success)throw new Error(d.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${d.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),ht("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(l){console.error("submitDirectWaste error:",l),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+l.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),i&&(i.disabled=!1,i.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function oo(){let t=document.getElementById("createWasteModal"),o=X(),a=document.getElementById("wasteModalSite"),e=document.getElementById("wasteModalDate");if(e&&!e.value&&(e.value=new Date().toISOString().slice(0,10)),a){let r="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(s=>{r+=`<option value="${s.code}" ${s.code===o?"selected":""}>${s.ten||s.name}</option>`}),a.innerHTML=r,a.value=o}await qt(o);let n=document.getElementById("wasteLinesContainer");n&&(n.innerHTML=""),Ut(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function He(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function ao(){let t=document.getElementById("wasteModalSite")?.value||"K001";await qt(t);let o=document.getElementById("wasteLinesContainer");o&&(o.innerHTML=""),Ut()}async function qt(t){try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=a.success&&a.data?a.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function Ut(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let o=window.gWasteModalInStockItems||[],a="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),e='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';o.forEach(r=>{e+=`<option value="${m(r.code)}" data-price="${r.unit_price}" data-unit="${m(r.unit||"")}" data-stock="${r.book_qty}">[${m(r.code)}] ${m(r.name)} (T\u1ED3n: ${Number(r.book_qty).toFixed(1)} ${m(r.unit||"")})</option>`});let n=`
    <div id="${a}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${a}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${e}
        </select>
        <button type="button" onclick="document.getElementById('${a}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${a}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">\u0110\u01A1n Gi\xE1</label>
          <div class="waste-modal-price py-1 px-2 text-xs tabular-nums text-gray-600 dark:text-gray-300 font-mono">0 \u20AB</div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Th\xE0nh Ti\u1EC1n</label>
          <div class="waste-modal-amt py-1 px-2 text-xs font-bold tabular-nums text-rose-600 text-right font-mono">0 \u20AB</div>
        </div>
      </div>
    </div>
  `;t.insertAdjacentHTML("beforeend",n),window.lucide&&window.lucide.createIcons()}function ro(t,o){let a=document.getElementById(t);if(!a)return;let e=o.options[o.selectedIndex],n=Number(e?.getAttribute("data-price"))||0,r=Number(e?.getAttribute("data-stock"))||0,s=a.querySelector(".waste-modal-price");s&&(s.textContent=Math.round(n).toLocaleString("vi-VN")+" \u20AB");let i=a.querySelector(".waste-modal-qty");i&&(i.max=String(r),i.placeholder=`T\u1ED1i \u0111a ${r.toFixed(1)}`),Ne(t,i?i.value:"0")}function Ne(t,o){let a=document.getElementById(t);if(!a)return;let e=a.querySelector("select"),n=e?.options[e.selectedIndex],r=Number(n?.getAttribute("data-price"))||0,i=(parseFloat(o)||0)*r,l=a.querySelector(".waste-modal-amt");l&&(l.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),Fe()}function Fe(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let o=0;t.querySelectorAll(".p-3").forEach(e=>{let n=e.querySelector("select"),r=n?.options[n.selectedIndex],s=Number(r?.getAttribute("data-price"))||0,i=e.querySelector(".waste-modal-qty"),l=parseFloat(i?.value||"0")||0;o+=l*s});let a=document.getElementById("wasteModalTotalAmount");a&&(a.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function so(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let o=[];if(t.querySelectorAll(".p-3").forEach(c=>{let u=c.querySelector("select"),h=u?.value,g=u?.options[u.selectedIndex],y=Number(g?.getAttribute("data-price"))||0,p=c.querySelector(".waste-modal-qty"),b=parseFloat(p?.value||"0")||0;h&&b>0&&o.push({item_code:h,qty:b,unit_price:y,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let a=document.getElementById("wasteModalSite")?.value||X(),e=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),n=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",r=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",s=document.getElementById("wasteModalNotes")?.value||"",i=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",l={site_code:a,waste_date:e,reason:n,confirmed_by:r,notes:s,created_by:i,lines:o},d=document.getElementById("btnSubmitWaste");d&&(d.disabled=!0,d.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let u=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${u.data.waste_code}!`),He(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),ht("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(c){console.error("submitCreateWaste error:",c),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+c.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),d&&(d.disabled=!1,d.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function Ya(){$e();let t=X(),o=document.getElementById("fnbWasteFilterSite");o&&o.value!==t&&(o.value=t);let a=document.getElementById("fnbWasteSummary");a&&(a.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let n=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();n.success&&n.data?window.gFnbWasteStockItems=(n.data.items||[]).map(r=>({...r,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],Be(),yt(),_e(t)}catch(e){console.error("loadFnbWaste error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+e.message)}}var C=window;C.gFnbWasteStockItems=C.gFnbWasteStockItems||[];C.gFnbWasteNganhMap=C.gFnbWasteNganhMap||null;C.gWasteModalInStockItems=C.gWasteModalInStockItems||[];C.getActiveFnbWasteSite=X;C.populateFnbWasteSiteDropdown=$e;C.loadFnbWaste=Ya;C.switchFnbWasteSubView=ht;C.populateFnbWasteFilters=Be;C.populateFnbWasteNhomHangDropdown=Kt;C.onFnbWasteNganhHangChange=Qn;C.onFnbWasteFilterChange=zn;C.onFnbWasteSearch=Jn;C.onFnbWasteSiteChange=Yn;C.renderFnbWasteStockTable=yt;C.onWasteLineQtyChange=Zn;C.onWasteLineReasonChange=to;C.onWasteLineNoteChange=eo;C.updateWasteKPIs=Xt;C.submitDirectWaste=no;C.loadFnbWasteHistory=_e;C.viewWasteDetail=Gn;C.openCreateWasteModal=oo;C.closeCreateWasteModal=He;C.onWasteModalSiteChange=ao;C.loadWasteModalItems=qt;C.addWasteLineRow=Ut;C.onWasteModalItemSelect=ro;C.onWasteModalLineQtyInput=Ne;C.recalculateWasteModalTotal=Fe;C.submitCreateWaste=so;function J(){let t=localStorage.getItem("orbit_user_site"),o=document.getElementById("globalBranchSelect")?.value,a=window,e=typeof a.App<"u"&&a.App.currentBranch?a.App.currentBranch.toUpperCase():null,n=document.getElementById("fnbCountSiteSelect")?.value,r=t||o||e||n||"K001";return(r==="ALL"||r==="all")&&(r="K001"),r.toUpperCase()}function Gt(){let t=document.getElementById("fnbCountNganhHangFilter"),o=document.getElementById("fnbCountNhomHangFilter");if(!t||!o)return;let a=new Map;(window.gFnbAllItems||[]).forEach(r=>{let s=(r.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),i=(r.nhom_hang||r.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();a.has(s)||a.set(s,new Set),a.get(s).add(i)}),window.gFnbNganhMap=a;let n='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(a.keys()).sort().forEach(r=>{n+=`<option value="${m(r)}">${m(r)}</option>`}),t.innerHTML=n,t.value="",Qt("")}function Qt(t){let o=document.getElementById("fnbCountNhomHangFilter");if(!o)return;let a=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(n=>a.add(n)):window.gFnbNganhMap.forEach(n=>n.forEach(r=>a.add(r))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(a).sort().forEach(n=>{e+=`<option value="${m(n)}">${m(n)}</option>`}),o.innerHTML=e,o.value=""}function io(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";Qt(t),U()}function lo(){U()}function co(t){U()}function uo(){U()}function po(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let o=document.getElementById("globalBranchSelect");o&&(o.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function go(t){window.gFnbBlindCount=t,U()}function mo(t,o){let a=(window.gCurrentCountItems||[]).find(e=>e.code===t);a&&(a.userCount=o===""?0:Number(o),U())}function fo(t,o){let a=(window.gCurrentCountItems||[]).find(e=>e.code===t);a&&(a.userNote=o)}function U(){let t=document.getElementById("fnbCountsTableBody"),o=document.getElementById("fnbCountsMobileCards"),a=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),e=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),n=document.getElementById("fnbCountStatusFilter")?.value||"all",r=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),s=window.gFnbAllItems||[],i=s.filter(p=>{if(a&&(p.nganh_hang||"").trim().toLowerCase()!==a||e&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==e)return!1;if(n!=="all"){let b=Number(p.book_qty)||0,x=(p.userCount!==void 0?Number(p.userCount):p.last_count_qty!==null&&p.last_count_qty!==void 0?Number(p.last_count_qty):b)-b,w=p.userCount!==void 0||p.last_count_qty!==null;if(n==="diff"&&Math.abs(x)<.001||n==="matched"&&Math.abs(x)>=.001||n==="counted"&&!w||n==="uncounted"&&w)return!1}if(r){let b=(p.name||"").toLowerCase(),f=(p.code||"").toLowerCase(),x=(p.nganh_hang||"").toLowerCase(),w=(p.nhom_hang||"").toLowerCase();if(!b.includes(r)&&!f.includes(r)&&!x.includes(r)&&!w.includes(r))return!1}return!0});window.gCurrentCountItems=i;let l=0,d=0,c=0;i.forEach(p=>{let b=Number(p.book_qty)||0,f=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:b,w=(Number(f)||0)-b,v=w*(Number(p.unit_price)||0);Math.abs(w)<.001?l++:d++,c+=v});let u=document.getElementById("fnbCountMetricTotal");u&&(u.textContent=String(i.length));let h=document.getElementById("fnbCountMetricMatched");h&&(h.textContent=String(l));let g=document.getElementById("fnbCountMetricDiff");g&&(g.textContent=String(d));let y=document.getElementById("fnbCountMetricDiffVal");y&&(y.textContent=(c>0?"+":"")+Math.round(c).toLocaleString("vi-VN")+" \u0111"),t&&(i.length===0?!s||s.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=i.map((p,b)=>{let f=Number(p.book_qty)||0,x=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:f,w=Number(x)||0,v=w-f,T=v*(Number(p.unit_price)||0),E='<span class="text-gray-400 tabular-nums">0</span>';v>0?E=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${v.toFixed(1)}</span>`:v<0&&(E=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${v.toFixed(1)}</span>`);let _='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';T>0?_=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(T).toLocaleString("vi-VN")} \u0111</span>`:T<0&&(_=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(T).toLocaleString("vi-VN")} \u0111</span>`);let V=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${f<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${f.toFixed(1)}</span>`,F=p.nhom_hang||p.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${b+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${m(p.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${m(p.code)}</span>
                ${F?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${m(F)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${m(p.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${V}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${w}" oninput="onCountInputChange('${m(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${E}</td>
            <td class="py-3 px-3 text-right select-all">${_}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${m(p.userNote||"")}" oninput="onCountNoteChange('${m(p.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),o&&(i.length===0?!s||s.length===0?o.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':o.innerHTML=i.map(p=>{let b=Number(p.book_qty)||0,f=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:b,x=Number(f)||0,w=x-b,v=w*(Number(p.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${m(p.nhom_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${m(p.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${m(p.code)}</span> \u2022 ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111/${m(p.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${b<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":b.toFixed(1)} ${m(p.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${m(p.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${w>0?"text-emerald-600":w<0?"text-rose-600":"text-gray-400"}">
                  ${w>0?"+":""}${w.toFixed(1)} (${(v>0?"+":"")+Math.round(v).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${m(p.userNote||"")}" oninput="onCountNoteChange('${m(p.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function ho(){let t=J(),o=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a="DAILY",e=window.gCurrentCountItems||[];if(!e||!e.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let n=e.map(s=>{let i=Number(s.book_qty)||0,l=s.userCount!==void 0?Number(s.userCount):s.last_count_qty!==null&&s.last_count_qty!==void 0?Number(s.last_count_qty):i,d=l-i,c=d*(Number(s.unit_price)||0);return{item_code:s.code,item_name:s.name,item_group:s.item_group||s.nhom_hang||"NVL",unit:s.unit,unit_price:Number(s.unit_price)||0,book_qty:i,actual_qty:l,count_qty:l,diff_qty:d,diff_value:c,diff_val:c,note:s.userNote||""}}),r={site_code:t,count_date:o,count_type:a,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:n};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let i=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!i.success)throw new Error(i.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${i.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(s){console.error("saveFnbCountAudit error:",s),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+s.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Re(t){let o=t||J();try{let e=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(o)}`)).json(),n=document.getElementById("fnbCountsHistoryBody"),r=document.getElementById("fnbCountsHistoryMobileCards");if((n||r)&&e.success){let s=e.data.counts||[];s.length?(n&&(n.innerHTML=s.map(i=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${i.id})">${m(i.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${m(i.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${m(i.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${i.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${i.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${i.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${i.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${i.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${i.diff_value>0||i.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(i.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${m(i.notes||"\u2014")}</td>
            </tr>
          `).join("")),r&&(r.innerHTML=s.map(i=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${i.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${m(i.count_code)}</span>
                <span class="badge ${i.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${i.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${m(i.site_code)}</b></span>
                  <span class="num text-gray-500">${i.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${i.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(i.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${i.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(i.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(i.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(n&&(n.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${m(o)}.</td></tr>`),r&&(r.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${m(o)}.</div>`))}}catch(a){console.error("loadFnbCountsHistory error:",a)}}async function yo(t){try{typeof window.showLoading=="function"&&window.showLoading();let a=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let e=a.data.lines||[],n=document.getElementById("invDetailModal"),r=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");r&&(r.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),s&&(s.textContent=`${e.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let i=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-3 text-right">T\u1ED3n S\xE1ch</th>
              <th class="py-2 px-3 text-right">SL \u0110\u1EBFm</th>
              <th class="py-2 px-3 text-right">L\u1EC7ch</th>
              <th class="py-2 px-3 text-right">Ti\u1EC1n L\u1EC7ch</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${e.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${m(d.item_name||d.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${d.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${d.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_qty<0?"text-rose-600":d.diff_qty>0?"text-emerald-600":"text-gray-400"}">${d.diff_qty>0?"+":""}${d.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_val<0?"text-rose-600":d.diff_val>0?"text-emerald-600":"text-gray-400"}">${d.diff_val>0?"+":""}${Math.round(d.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${m(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),n&&n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(o){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function bo(){document.getElementById("invDetailModal")?.classList.add("hidden")}function xo(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let o=J(),a=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),n=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((l,d)=>{let c=Number(l.book_qty)||0,u=l.userCount!==void 0?Number(l.userCount):l.last_count_qty!==null&&l.last_count_qty!==void 0?Number(l.last_count_qty):c,h=u-c;n.push([d+1,l.code,l.name,l.nganh_hang||"",l.nhom_hang||l.item_group||"",l.unit,Number(l.unit_price)||0,c,u,h,l.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let r=XLSX.utils.aoa_to_sheet(n);r["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],r["!autofilter"]={ref:`A1:K${n.length}`},r["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let s=XLSX.utils.decode_range(r["!ref"]||"A1:K1");for(let l=s.s.r;l<=s.e.r;++l)for(let d=s.s.c;d<=s.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(r[c])if(l===0)r[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:d===0||d===1?"center":d>=6&&d<=9?"right":"left",wrapText:!1}};else{let u=d===0||d>=6&&d<=9,h=d===1||d===5;r[c].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:u?"right":h?"center":"left"}}}}let i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,r,"PhieuKiemKe"),XLSX.writeFile(i,`Phieu_Kiem_Ke_${o}_${a}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function Za(){let t=J(),o=document.getElementById("fnbCountSiteSelect");o&&o.value!==t&&(o.value=t);let e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(i=>i.code.toUpperCase()===t.toUpperCase()),n=e?e.ten||e.name:t,r=document.getElementById("fnbCountCurrentSiteBadge");r&&(r.textContent=n);let s=document.getElementById("fnbCountDatePicker");s&&!s.value&&(s.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let l=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();l.success&&l.data?(window.gFnbAllItems=l.data.items||[],Gt(),U()):(window.gFnbAllItems=[],Gt(),U()),Re(t)}catch(i){console.error("loadFnbCounts error:",i),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+i.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var M=window;M.gFnbAllItems=M.gFnbAllItems||[];M.gCurrentCountItems=M.gCurrentCountItems||[];M.gFnbBlindCount=M.gFnbBlindCount||!1;M.gFnbNganhMap=M.gFnbNganhMap||null;M.getActiveFnbCountSite=J;M.loadFnbCounts=Za;M.populateFnbCountFilters=Gt;M.populateFnbCountNhomHangDropdown=Qt;M.onFnbCountNganhHangChange=io;M.onFnbCountFilterChange=lo;M.onFnbCountSearch=co;M.onFnbCountDateChange=uo;M.onFnbCountSiteChange=po;M.toggleBlindCount=go;M.onCountInputChange=mo;M.onCountNoteChange=fo;M.renderFnbCountsTable=U;M.saveFnbCountAudit=ho;M.loadFnbCountsHistory=Re;M.viewCountDetail=yo;M.closeInvDetailModal=bo;M.exportCountSheetExcel=xo;function zt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let o=t.sites||[],a=t.rows||[],e=t.groups||{},n=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];o.forEach(u=>{n.push(u.ten||u.name||u.code)});let r=[n];a.forEach((u,h)=>{let g=e[u.group]||u.group,y=[h+1,u.code,u.name,g,u.unit,u.price||0];o.forEach(p=>{let b=u.cells?u.cells[p.id]:void 0;y.push(b&&b.book||0)}),r.push(y)});let s=XLSX.utils.aoa_to_sheet(r),i=XLSX.utils.decode_range(s["!ref"]),l=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];o.forEach(()=>l.push({wch:16})),s["!cols"]=l;for(let u=i.s.r;u<=i.e.r;++u)for(let h=i.s.c;h<=i.e.c;++h){let g=XLSX.utils.encode_cell({r:u,c:h});if(!s[g])continue;if(u===0)s[g].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let p="left",b;h===0||h===1||h===4?p="center":(h===5||h>=6)&&(p="right",b="#,##0.00");let f=h>=6&&typeof s[g].v=="number"&&s[g].v<0;s[g].s={font:{name:"Aptos",sz:11,bold:f,color:{rgb:f?"C00000":"000000"}},alignment:{horizontal:p,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},b&&typeof s[g].v=="number"&&(s[g].z=b)}}s["!autofilter"]={ref:s["!ref"]},s["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let d=XLSX.utils.book_new();XLSX.utils.book_append_sheet(d,s,"T\u1ED3n Kho Chu\u1ED7i F&B");let c=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(d,`Ton_Kho_F&B_Chuoi_${c}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(o){console.error("Export Excel error:",o),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(o?.message||o))}}var G=null,H={site:"ALL",group:"ALL",search:"",showValue:!1},Jt="";async function De(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);H.site&&H.site!=="ALL"&&H.site!=="all"&&t.searchParams.set("site_code",H.site),H.region&&H.region!=="ALL"&&t.searchParams.set("regionId",H.region),H.group&&H.group!=="ALL"&&t.searchParams.set("group",H.group),t.searchParams.set("refresh","true");let a=await(await fetch(t.toString())).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");G=a.data,window.gFnbStockData=G,Tt()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function Tt(){if(!G)return;let t=G.sites||[],o=G.rows||[],a=G.groups||{},e=(Jt||"").trim().toLowerCase(),n=o.filter(f=>{if(!e)return!0;let x=(f.name||"").toLowerCase().includes(e),w=(f.code||"").toLowerCase().includes(e);return x||w}),r=H.site,s=n;r&&r!=="ALL"&&r!=="all"&&(s=n.filter(f=>{let x=f.cells&&f.cells[r];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let i=0,l=0,d=0;n.forEach(f=>{t.forEach(x=>{let w=f.cells&&f.cells[x.id];if(w){let v=Number(w.value)||0,T=Number(w.book)||0;i+=v,T<0&&l++,w.noOpening&&d++}})});let c=document.getElementById("fnbStockKpiTotalItems"),u=document.getElementById("fnbStockKpiTotalValue"),h=document.getElementById("fnbStockKpiNegative"),g=document.getElementById("fnbStockKpiNoOpening");c&&(c.textContent=s.length.toLocaleString("vi-VN")),u&&(u.textContent=Math.round(i).toLocaleString("vi-VN")+" \u0111"),h&&(h.textContent=l.toLocaleString("vi-VN")),g&&(g.textContent=d.toLocaleString("vi-VN"));let y=document.getElementById("fnbStockTableHead");if(y){let f=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(x=>{let w=x.region==="Mi\u1EC1n Nam";f+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${w?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${w?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),f+="</tr>",y.innerHTML=f}let p=document.getElementById("fnbStockTableBody");p&&(s.length===0?p.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:p.innerHTML=s.map((f,x)=>{let w=a[f.group]||f.group,v=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${w}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${f.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${f.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${f.price?Number(f.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${f.unit}</td>
        `;return t.forEach(T=>{let E=f.cells&&f.cells[T.id]||{book:0,lastCount:null,noOpening:!0,value:0},_=Number(E.book)||0,F=_<0?"text-rose-600 dark:text-rose-400 font-semibold":_>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",Lt="";if(E.lastCount!==null&&E.lastCount!==void 0&&E.lastCount!==""){let jt=Number(E.lastCount);if(!isNaN(jt)){let Sn=Number.isInteger(jt)?jt.toLocaleString("vi-VN"):jt.toFixed(1);Lt=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${E.lastDate||"N/A"}): ${Sn}">(${Sn})</span>`}}let pt="";E.noOpening&&(pt='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let we="",Ln=Number(E.value)||0;H.showValue&&Ln&&(we=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(Ln).toLocaleString("vi-VN")} \u0111</div>`);let Ja=Number.isInteger(_)?_.toLocaleString("vi-VN"):_.toFixed(1);v+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${pt}
                <span class="${F}">${Ja}</span>${Lt}
              </div>
              ${we}
            </td>
          `}),v+="</tr>",v}).join(""));let b=document.getElementById("fnbStockMobileCards");b&&(s.length===0?b.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':b.innerHTML=n.map(f=>{let x=a[f.group]||f.group,w=t.map(v=>{let T=f.cells&&f.cells[v.id]||{book:0,lastCount:null,noOpening:!0,value:0},E=Number(T.book)||0,_=E<0,V=E===0,F=Number.isInteger(E)?E.toLocaleString("vi-VN"):E.toFixed(1),Lt="";if(T.lastCount!==null&&T.lastCount!==void 0&&T.lastCount!==""){let pt=Number(T.lastCount);isNaN(pt)||(Lt=`(${Number.isInteger(pt)?pt.toLocaleString("vi-VN"):pt.toFixed(1)})`)}return{site:v,cell:T,isNeg:_,isZero:V,bookFormatted:F,countText:Lt}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${f.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${f.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${f.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${f.price?Number(f.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${w.map(v=>{let T=v.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${v.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":v.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${v.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${T?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${T?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${v.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":v.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${v.bookFormatted} <span class="text-xs text-gray-400 font-normal">${v.countText}</span></span>
                    </div>
                    ${v.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${H.showValue&&v.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(v.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function wo(){let t=document.getElementById("fnbStockFilterRegion"),o=document.getElementById("fnbStockFilterGroup"),a=document.getElementById("fnbStockFilterSite");a&&(H.site=a.value),t&&(H.region=t.value),o&&(H.group=o.value),De()}function vo(t){Jt=t,Tt()}function ko(t){H.showValue=t,Tt()}function Es(){zt(G)}var Q=window;Q.gFnbStockData=G;Q.gFnbStockFilter=H;Q.gFnbStockSearchTerm=Jt;Q.loadFnbStock=De;Q.renderFnbStock=Tt;Q.onFnbStockFilterChange=wo;Q.onFnbStockSearch=vo;Q.onFnbStockToggleValue=ko;Q.exportFnbStockExcel=()=>zt(Q.gFnbStockData||G);function Ae(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function Pe(t,o){return typeof window.cellBadge=="function"?window.cellBadge(t,o):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${o}</span>`}function Oe(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let o=document.createElement("div");return o.textContent=t||"",o.innerHTML}function B(t){return typeof window.fmtVND=="function"?window.fmtVND(t):S(Number(t)||0)}function je(t){return typeof window.fmtNum=="function"?window.fmtNum(t):L(Number(t)||0)}function Y(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function Yt(t){let o=window;o.App||(o.App={}),o.App.items=t}function Ct(){let t=document.getElementById("dinhMucBody"),o=document.getElementById("orderMobileCards"),a=(document.getElementById("orderSearch")?.value||"").toLowerCase(),e=document.getElementById("fLoai")?.value||"",n=document.getElementById("fChiNhap")?.checked,r=document.getElementById("orderSupplyChannel")?.value||"ALL",i=Y().filter(d=>{if(a&&!d.maHang.toLowerCase().includes(a)&&!d.tenSP.toLowerCase().includes(a)||e&&d.tenLoai!==e||n&&(!d.soLuongDat||d.soLuongDat<=0))return!1;if(r==="BTT"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("btt")&&!c.includes("trung t\xE2m")&&!c.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(r==="NCC"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")).toLowerCase();if(c.includes("btt")||c.includes("trung t\xE2m"))return!1}else if(r==="URGENT"){let c=((d.nganh_hang||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("t\u01B0\u01A1i")&&!c.includes("th\u1ECBt")&&!c.includes("rau")&&!c.includes("kh\u1EA9n"))return!1}return!0});if(!i.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let l=window.innerWidth>=1024;t&&(l?t.innerHTML=i.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <tr>
            <td class="col-code">${Ae(d.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${d.tenSP}</span></td>
            <td>${Pe("neutral",d.tenLoai||"CCDC")}</td>
            <td>${d.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${B(d.donGia)}</span></td>
            <td class="col-num"><span class="num">${je(d.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${c}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${d.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${d.maHang}">${B(u)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),o&&(l?o.innerHTML="":o.innerHTML=i.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${Ae(d.maHang)}
                  ${Pe("neutral",d.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${d.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${d.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${B(d.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${je(d.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${c}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${d.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${d.maHang}">${B(u)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Lo(){Ct()}function So(t,o){let e=Y().find(n=>n.maHang===t);if(e){e.soLuongDat=Number(o)||0;let n=document.getElementById(`subtotal-${t}`);n&&(n.textContent=B(e.soLuongDat*(e.donGia||0)));let r=document.getElementById(`mob-subtotal-${t}`);r&&(r.textContent=B(e.soLuongDat*(e.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(s=>{s.value!==o&&(s.value=o)})}Et()}function Et(t,o){let a=document.getElementById("kpiNganSach"),e=document.getElementById("kpiDaDat"),n=t!==void 0?Number(t):Number(a?.dataset?.raw)||Number((a?.textContent||"").replace(/[^\d]/g,""))||0,r=o!==void 0?Number(o):Number(e?.dataset?.raw)||Number((e?.textContent||"").replace(/[^\d]/g,""))||0,i=Y().reduce((w,v)=>w+(v.soLuongDat||0)*(v.donGia||0),0),l=r+i,d=n-l,c=n>0?Math.round(l/n*100):0,u=document.getElementById("kpiConLai");u&&(u.dataset.raw=String(d),u.textContent=B(d),u.title=B(d),d<0?(u.classList.remove("text-gray-900","dark:text-white"),u.classList.add("text-rose-600","dark:text-rose-400")):(u.classList.remove("text-rose-600","dark:text-rose-400"),u.classList.add("text-gray-900","dark:text-white")));let h=document.getElementById("kpiDangNhapSub");h&&(h.textContent="\u0110ang nh\u1EADp: "+B(i));let g=document.getElementById("kpiConLaiDelta");g&&(d<0?(g.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",g.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(g.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",g.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let y=document.getElementById("kpiTyLe");y&&(y.textContent=c+"%",c>100?y.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":c>80?y.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":y.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let p=document.getElementById("budUsed");p&&(p.textContent=B(l));let b=document.getElementById("budFill"),f=document.getElementById("budBadge"),x=document.getElementById("budNote");b&&(b.style.width=Math.min(c,100)+"%",c>100?(b.className="h-full rounded-full bg-rose-500 transition-all duration-300",f&&(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",f.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${c-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${c-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):c>80?(b.className="h-full rounded-full bg-amber-500 transition-all duration-300",f&&(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",f.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${c}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(b.className="h-full rounded-full bg-indigo-500 transition-all duration-300",f&&(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",f.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${c}%).`)))}async function We(){let t=window,o=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",e=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(d=>(d.code||"").toLowerCase()===o.toLowerCase()),n=e?e.ten||e.name:document.getElementById("orderSite")?.value||o,r=document.getElementById("orderSite");if(r&&(r.innerHTML=`<option value="${n}">${n}</option>`,r.value=n),!n)return;let s=document.getElementById("globalMonthPicker")?.value,i=document.getElementById("orderMonth")?.value;if(!i||s&&i!==s){i=s||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let d=document.getElementById("orderMonth");d&&(d.value=i)}let l="";if(i){let d=i.split("-");l=`${d[1]}/${d[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let c=await(await fetch(`/api/quota?site=${encodeURIComponent(n)}&thang=${encodeURIComponent(l)}&refresh=true`)).json();if(c.success){Yt(c.data.items||[]);let u=document.getElementById("kpiNganSach");u&&(u.dataset.raw=String(c.data.nganSach),u.textContent=B(c.data.nganSach),u.title=B(c.data.nganSach));let h=document.getElementById("kpiSubSite");h&&(h.textContent=c.data.site||n,h.title=c.data.site||n);let g=document.getElementById("kpiDaDat");g&&(g.dataset.raw=String(c.data.tienDaDat),g.textContent=B(c.data.tienDaDat),g.title=B(c.data.tienDaDat));let y=document.getElementById("budTotal");y&&(y.textContent=B(c.data.nganSach));let p=Y(),b=Array.from(new Set(p.map(x=>x.tenLoai).filter(Boolean))),f=document.getElementById("fLoai");f&&(f.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+b.map(x=>`<option value="${x}">${x}</option>`).join("")),Ct(),Et(c.data.nganSach,c.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(c.error||""))}catch(d){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(d?.message||d))}finally{typeof hideLoading=="function"&&hideLoading()}}function To(){let o=Y().filter(s=>(s.soLuongDat||0)>0);if(!o.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let a=document.getElementById("orderSite")?.value||"",e=document.getElementById("orderMonth")?.value||"",n=o.reduce((s,i)=>s+(i.soLuongDat||0)*(i.donGia||0),0),r=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${a}</b></div>
        <div>Th\xE1ng: <b>${e}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${B(n)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${o.map(s=>`
              <tr><td class="p-2 tabular-nums">${s.maHang}</td><td class="p-2">${s.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${s.soLuongDat}</td><td class="p-2 text-right tabular-nums">${B((s.soLuongDat||0)*s.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${o.map(s=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${Oe(s.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${Oe(s.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${s.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${B((s.soLuongDat||0)*s.donGia)}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div>
        <label class="font-bold block mb-1">Ghi ch\xFA / Gi\u1EA3i tr\xECnh:</label>
        <textarea id="orderNote" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Ghi ch\xFA \u0111\u01A1n h\xE0ng..."></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeGeneralModal()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold">Xem l\u1EA1i</button>
        <button onclick="submitOrder()" class="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm">G\u1EEDi \u0111\u01A1n \u0111\u1EB7t h\xE0ng</button>
      </div>
    </div>
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",r)}async function Co(){let t=window,o=Y(),a=o.filter(i=>(i.soLuongDat||0)>0),e=document.getElementById("orderSite")?.value||"",n=document.getElementById("orderMonth")?.value||"",r=document.getElementById("orderNote"),s=r?r.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let i={site:e,thang:n,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:s,items:a.map(c=>({maHang:c.maHang,tenSP:c.tenSP,dvt:c.dvt,donGia:c.donGia,soLuong:c.soLuongDat||0,daDat:c.daDat}))},d=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();d.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${d.data.maDon}`),o.forEach(c=>{c.soLuongDat=0}),We()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(i){typeof showToast=="function"&&showToast("L\u1ED7i: "+(i?.message||i))}finally{typeof hideLoading=="function"&&hideLoading()}}var Z=window;Z.loadQuota=We;Z.renderOrderTable=Ct;Z.filterItems=Lo;Z.onQtyChange=So;Z.calcBudget=Et;Z.reviewOrder=To;Z.submitOrder=Co;Z.getAppOrderItems=Y;Z.setAppOrderItems=Yt;function Ve(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function Eo(t){return typeof window.cellDate=="function"?window.cellDate(t):`<span class="tabular-nums text-xs text-gray-500">${tt(t)}</span>`}function Ke(t){return typeof window.cellPerson=="function"?window.cellPerson(t):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${I(t||"\u2014")}</span>`}function Xe(t,o){return typeof window.cellBadge=="function"?window.cellBadge(t,o):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${o}</span>`}function I(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function A(t){return typeof window.fmtVND=="function"?window.fmtVND(t):S(Number(t)||0)}function bt(t){return typeof window.fmtNum=="function"?window.fmtNum(t):L(Number(t)||0)}function tt(t){return t?typeof window.fmtDate=="function"?window.fmtDate(t):z(t):"\u2014"}function et(t){let o=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||o.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let e=a.permissions["portal-history"],n=a.permissions["portal-order"];if(e&&e.canEdit!==void 0)return!!e.canEdit;if(n&&n.canEdit!==void 0)return!!n.canEdit}if(a.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function nt(t){let o=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||o.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let e=a.permissions["portal-history"],n=a.permissions["portal-order"];if(e&&e.canDelete!==void 0)return!!e.canDelete;if(n&&n.canDelete!==void 0)return!!n.canDelete}if(a.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function Zt(t){let o=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||o.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let e=a.permissions["portal-history"],n=a.permissions["portal-order"];if(e&&(e.canAuthenticate!==void 0||e.canVerify!==void 0||e.canEdit!==void 0))return!!(e.canAuthenticate||e.canVerify||e.canEdit);if(n&&(n.canAuthenticate!==void 0||n.canVerify!==void 0||n.canEdit!==void 0))return!!(n.canAuthenticate||n.canVerify||n.canEdit)}return!1}function te(t,o,a){let e=Number(t)||1,r=o||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[e]||`B\u01B0\u1EDBc ${e}`,s="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",i="bg-blue-500";return e>=7?(s="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",i="bg-emerald-500"):e>=4?(s="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",i="bg-indigo-500"):e>=2&&(s="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",i="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${a}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${i} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${e}/7:</span>
      <span class="truncate max-w-[100px] text-left">${I(r)}</span>
    </button>
  `}function ee(t){let o=document.getElementById("hsBody"),a=document.getElementById("hsMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=et(e),r=nt(e);return`
        <tr>
          <td class="col-code min-w-[130px]">${Ve(e.maDon)}</td>
          <td class="col-date min-w-[110px]">${Eo(e.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${I(e.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${Ke(e.nguoiDat)}</td>
          <td class="col-num">${e.soDong}</td>
          <td class="col-num font-medium">${bt(e.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${A(e.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${Xe("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${te(e.currentStep,e.currentStepName,e.maDon)}
          </td>
          <td class="col-actions min-w-[220px]">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="viewOrderDetail('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs hover:border-slate-400 dark:hover:border-gray-600 transition" title="Xem chi ti\u1EBFt \u0111\u01A1n h\xE0ng">
                <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Xem</span>
              </button>
              <button onclick="openOrderJourneyModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition" title="Theo d\xF5i & X\xE1c th\u1EF1c h\xE0nh tr\xECnh">
                <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                <span>H\xE0nh tr\xECnh</span>
              </button>
              ${n?`
                <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${r?`
                <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="X\xF3a \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=et(e),r=nt(e);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${Ve(e.maDon)}
            ${Xe("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${I(e.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${te(e.currentStep,e.currentStepName,e.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${tt(e.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${Ke(e.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${e.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${bt(e.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${A(e.tongTien)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewOrderDetail('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Chi ti\u1EBFt</span>
            </button>
            <button onclick="openOrderJourneyModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh</span>
            </button>
            ${n?`
              <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${r?`
              <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `}).join(""))}function qe(t){let o=window,a=o.App&&o.App.historyOrders?o.App.historyOrders:[];if(!t||t==="ALL"){ee(a);return}let e=a.filter(n=>{let r=(n.trangThai||"").toUpperCase();return t==="APPROVED"?r.includes("DUY\u1EC6T")||r.includes("APPROVED"):t==="PENDING"?r.includes("CH\u1EDC")||r.includes("T\u1EA0O")||r.includes("PENDING"):t==="DELIVERED"?r.includes("NH\u1EACN")||r.includes("GIAO")||r.includes("DELIVERED"):t==="REJECTED"?r.includes("H\u1EE6Y")||r.includes("T\u1EEA CH\u1ED0I")||r.includes("REJECT"):!0});ee(e)}async function Io(){let t=window,o=document.getElementById("globalBranchSelect")?.value,a=t.gCurrentUser||(typeof t.loadPersistedUser=="function"?t.loadPersistedUser():null),e=a?a.assignedSite:"",n=localStorage.getItem("orbit_user_site"),r=document.getElementById("hsSite")?.value,s="";o?s=o==="ALL"?"":o:e?s=e==="ALL"?"":e:n?s=n==="ALL"?"":n:r&&(s=r==="ALL"?"":r);let i=document.getElementById("hsCurrentSiteBadge");if(i){if(s&&s!=="ALL"){let h=((typeof t.getAppSitesList=="function"?t.getAppSitesList():[])||[]).find(g=>g.code.toUpperCase()===s.toUpperCase()||g.name===s||g.ten&&g.ten===s);i.textContent=h?h.ten||h.name:s}else i.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";i.classList.remove("hidden")}let l=document.getElementById("hsSite");l&&(l.value=s);let d=document.getElementById("hsMonth")?.value||"",c="";if(d){let u=d.split("-");c=`${u[1]}/${u[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let u=`/api/orders?site=${encodeURIComponent(s)}&thang=${encodeURIComponent(c)}&_t=${Date.now()}`,g=await(await fetch(u,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();t.App||(t.App={}),t.App.historyOrders=g.success&&g.data?g.data:[];let y=document.getElementById("hsOrderStatusFilter")?.value||"ALL";qe(y)}catch(u){console.error("loadHistory error:",u)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function Mo(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}`)).json();if(a.success){let{info:e,items:n,timeline:r}=a.data,s=`
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <div class="tabular-nums font-bold">${e.order_code}</div>
              <div class="text-gray-500 dark:text-gray-400">${e.site_name} \xB7 ${e.ordered_by}</div>
            </div>
            <button onclick="if(typeof exportSingleOrderExcel==='function')exportSingleOrderExcel('${e.order_code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
              Xu\u1EA5t Excel
            </button>
          </div>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto max-h-48 rounded-xl border border-gray-200 dark:border-gray-800">
            <table class="data-table">
              <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2">\u0110VT</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">\u0110\u01A1n gi\xE1</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
              <tbody>
                ${(n||[]).map(i=>`<tr><td class="p-2 tabular-nums">${i.maHang}</td><td class="p-2">${i.tenSP}</td><td class="p-2">${i.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${i.soLuong}</td><td class="p-2 text-right tabular-nums">${A(i.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${A(i.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(n||[]).map(i=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${I(i.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${I(i.maHang)} \xB7 <span class="font-sans">${I(i.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${i.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${A(i.thanhTien)}</div>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="pt-2">
            <div class="flex items-center justify-between mb-2">
              <b class="text-gray-900 dark:text-white flex items-center gap-1.5">
                <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                H\xE0nh tr\xECnh x\u1EED l\xFD \u0111\u01A1n h\xE0ng:
              </b>
              <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${e.order_code}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
                <span>Xem & X\xE1c th\u1EF1c chi ti\u1EBFt</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800/80 pl-3">
              ${(r||[]).map(i=>`
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>B\u01B0\u1EDBc ${i.buoc}: ${i.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${i.thoiGian?tt(i.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${i.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${i.trangThai}</span>${i.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${I(i.ghiChu)}"</span>`:""}</div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh \u0111\u01A1n</span>
            </button>
            <div class="flex items-center gap-2">
              ${et(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${nt(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${t}`,s)}}catch(o){typeof showToast=="function"&&showToast("L\u1ED7i: "+(o?.message||o))}finally{typeof hideLoading=="function"&&hideLoading()}}var $o=null,_o=null,ne=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function oe(t,o){let a=document.getElementById("journeyTimelineContainer");if(!a)return;let e=document.getElementById("journeyCurrentStepText"),n={};(o||[]).forEach(i=>{let l=Number(i.buoc);l&&(n[l]=i)});let r=Object.keys(n).map(Number),s=r.length?Math.max(...r):1;e&&(e.textContent=`B\u01B0\u1EDBc ${s}/7 (${ne[s-1]?.name||""})`),a.innerHTML=ne.map(i=>{let l=n[i.step],d=l&&(l.trangThai==="Ho\xE0n th\xE0nh"||l.trangThai==="Ho\xE0n t\u1EA5t"),c=i.step===s||l&&!d,u="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",h=`<span class="font-mono text-xs font-bold">${i.step}</span>`,g="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",y="text-gray-500 dark:text-gray-400 font-medium",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return d?(u="bg-emerald-600 text-white border-emerald-600 shadow-sm",h='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',g="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",y="text-emerald-900 dark:text-emerald-200 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):c&&(u="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",h='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',g="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",y="text-indigo-900 dark:text-indigo-100 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${u}">
          ${h}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${g} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${y}">B\u01B0\u1EDBc ${i.step}: ${I(l?.tenBuoc||i.name)}</span>
            ${p}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${I(i.desc)}</p>
          ${l?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${I(l.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${l.thoiGian?tt(l.thoiGian):""}
              </div>
              ${l.ghiChu?`
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${I(l.ghiChu)} "
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}).join("")}async function Bo(t){if(!t)return;$o=t,window._currentJourneyOrderCode=t;let o=document.getElementById("modalOrderJourney");if(!o)return;let a=document.getElementById("journeyOrderSubtitle");a&&(a.textContent=`M\xE3 \u0111\u01A1n: ${t}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let n=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!n.success||!n.data){typeof showToast=="function"&&showToast(n.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:r,timeline:s}=n.data;_o=n.data,window._currentJourneyData=n.data;let i=document.getElementById("journeySiteName");i&&(i.textContent=r.site_name||r.site||"\u2014");let l=document.getElementById("journeyOrderedBy");l&&(l.textContent=r.ordered_by||"\u2014");let d=document.getElementById("journeyOrderDate");d&&(d.textContent=tt(r.order_date||""));let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=r.status||"\u0110ang x\u1EED l\xFD"),oe(r,s||[]);let u=Zt(r),h=document.getElementById("journeyAdminSection");if(h)if(u){h.classList.remove("hidden");let g=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,y=document.getElementById("journeyAdminActor");y&&(y.textContent=g&&(g.fullName||g.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let p=s&&s.length?Math.max(...s.map(w=>Number(w.buoc)||1)):1,b=Math.min(p+1,7),f=document.getElementById("journeySelectStep");f&&(f.value=String(b));let x=document.getElementById("journeyStepNote");x&&(x.value="")}else h.classList.add("hidden");o.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(e){console.error("Error openOrderJourneyModal:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Ho(){let t=document.getElementById("modalOrderJourney");t&&t.classList.add("hidden")}async function No(){let t=$o||window._currentJourneyOrderCode;if(!t)return;let o=document.getElementById("journeySelectStep"),a=document.getElementById("journeyStepStatus"),e=document.getElementById("journeyStepNote"),n=document.getElementById("btnSubmitJourneyStep"),r=Number(o?o.value:1),s=a?a.value:"Ho\xE0n th\xE0nh",i=e?e.value.trim():"",l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,d=l&&(l.fullName||l.email)||"Admin",u={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[r]||`B\u01B0\u1EDBc ${r}`;try{n&&(n.disabled=!0,n.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let g=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,step:r,stepName:u,status:s,note:i,actor:d})})).json();if(!g.success){typeof showToast=="function"&&showToast(g.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${r}: ${u}`,"success"),g.data&&g.data.timeline){let y=_o?.info||window._currentJourneyData?.info||{order_code:t};y.status=g.data.orderStatus;let p=document.getElementById("journeyBadgeStatus");p&&(p.textContent=y.status),oe(y,g.data.timeline),o&&r<7&&(o.value=String(r+1)),e&&(e.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(h){console.error("Error submitJourneyStep:",h),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{n&&(n.disabled=!1,n.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var N=[],Ue=null;async function Fo(t){if(!et()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:e,items:n}=a.data,r=document.getElementById("editOrderCode");r&&(r.value=e.order_code||t);let s=document.getElementById("editOrderSubtitle");s&&(s.textContent=`M\xE3 \u0111\u01A1n: ${e.order_code||t}`);let i=document.getElementById("editOrderSite");if(i){let p=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];i.innerHTML=p.map(b=>{let f=b.ten||b.name||b.code||b,x=e.site_name===f||e.site_name===b.name||e.site_name===b.code?"selected":"";return`<option value="${f}" ${x}>${f}</option>`}).join(""),e.site_name&&!p.some(b=>(b.ten||b.name||b.code)===e.site_name)&&i.insertAdjacentHTML("afterbegin",`<option value="${e.site_name}" selected>${e.site_name}</option>`)}let l=document.getElementById("editOrderDate");l&&(l.value=(e.order_date||"").slice(0,10));let d=document.getElementById("editOrderStatus");d&&(d.value=e.status||"M\u1EDBi t\u1EA1o");let c=document.getElementById("editOrderNguoiDat");c&&(c.value=e.ordered_by||"");let u=document.getElementById("editOrderThang");u&&(u.value=e.applied_month||"");let h=document.getElementById("editOrderGhiChu");h&&(h.value=""),N=(n||[]).map(p=>({maHang:p.maHang||p.item_code,tenSP:p.tenSP||p.item_name,dvt:p.dvt||p.unit||"Ph\u1EA7n",soLuong:Number(p.soLuong??p.order_qty??1),donGia:Number(p.donGia??p.unit_price??0),thanhTien:Number(p.thanhTien??(p.soLuong||1)*(p.donGia||0)),ghiChu:p.ghiChu||""})),window._editOrderItems=N;let g=document.getElementById("editOrderAddSelect");if(g){let p=window,b=p.App&&p.App.items&&p.App.items.length?p.App.items:[];if(!b.length)try{let x=await(await fetch(`/api/quota?site=${encodeURIComponent(e.site_name||"K001")}&thang=${encodeURIComponent(e.applied_month||"")}`)).json();x.success&&x.data?.items&&(b=x.data.items,p.App&&(p.App.items=b))}catch{}g.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+b.map(f=>`
          <option value="${I(f.maHang||f.code)}" 
                  data-name="${I(f.tenHang||f.tenSP||f.name||"")}" 
                  data-unit="${I(f.dvt||f.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(f.donGia||f.price||0)}">
            [${I(f.maHang||f.code)}] ${I(f.tenHang||f.tenSP||f.name||"")} (${A(f.donGia||f.price||0)}/${f.dvt||f.unit||""})
          </option>
        `).join("")}xt();let y=document.getElementById("modalEditOrder");y&&y.classList.remove("hidden")}catch(o){console.error("openEditOrderModal error:",o),typeof showToast=="function"&&showToast("L\u1ED7i: "+(o?.message||o),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function Ge(){let t=document.getElementById("modalEditOrder");t&&t.classList.add("hidden"),N=[],window._editOrderItems=[]}function xt(){let t=document.getElementById("editOrderItemsBody"),o=document.getElementById("editOrderItemsMobile"),a=N;t&&(a.length?t.innerHTML=a.map((e,n)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${n+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${I(e.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${I(e.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${I(e.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                   onchange="updateEditOrderItemQty(${n}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${A(e.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${A(e.soLuong*e.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${n})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="X\xF3a d\xF2ng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join(""):t.innerHTML='<tr><td colspan="8" class="p-4 text-center text-gray-400">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o. Vui l\xF2ng th\xEAm m\u1EB7t h\xE0ng b\xEAn d\u01B0\u1EDBi.</td></tr>'),o&&(a.length?o.innerHTML=a.map((e,n)=>`
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${I(e.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${I(e.maHang)} \xB7 <span class="font-sans">${I(e.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${n})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">S\u1ED1 l\u01B0\u1EE3ng:</span>
              <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                     onchange="updateEditOrderItemQty(${n}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${A(e.soLuong*e.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):o.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),Qe()}function Ro(t,o){let a=Math.max(0,Number(o)||0);N&&N[t]&&(N[t].soLuong=a,N[t].thanhTien=a*(N[t].donGia||0),xt())}function Do(t){N&&N.length>t&&(N.splice(t,1),xt())}function Ao(){let t=document.getElementById("editOrderAddSelect"),o=document.getElementById("editOrderAddQty");if(!t||!t.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let a=t.value,e=t.selectedOptions[0],n=e.getAttribute("data-name")||a,r=e.getAttribute("data-unit")||"Ph\u1EA7n",s=Number(e.getAttribute("data-price"))||0,i=Math.max(.1,Number(o?o.value:1)||1),l=N.find(d=>d.maHang===a);l?(l.soLuong+=i,l.thanhTien=l.soLuong*l.donGia):N.push({maHang:a,tenSP:n,dvt:r,soLuong:i,donGia:s,thanhTien:i*s,ghiChu:""}),t.value="",o&&(o.value="1"),xt()}function Qe(){let t=N,o=0,a=0;t.forEach(s=>{o+=Number(s.soLuong)||0,a+=(Number(s.soLuong)||0)*(Number(s.donGia)||0)});let e=document.getElementById("editOrderItemsCount");e&&(e.textContent=String(t.length));let n=document.getElementById("editOrderTotalQty");n&&(n.textContent=bt(o));let r=document.getElementById("editOrderTotalAmount");r&&(r.textContent=A(a))}async function Po(){if(!et()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let t=document.getElementById("editOrderCode")?.value;if(!t){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let o=document.getElementById("editOrderSite")?.value,a=document.getElementById("editOrderDate")?.value,e=document.getElementById("editOrderStatus")?.value,n=document.getElementById("editOrderNguoiDat")?.value,r=document.getElementById("editOrderThang")?.value,s=document.getElementById("editOrderGhiChu")?.value,i=N.filter(d=>(Number(d.soLuong)||0)>0);if(!i.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let c=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,site:o,orderDate:a,status:e,orderedBy:n,month:r,ghiChu:s,actor:l?l.full_name||l.fullName||l.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:i})})).json();if(!c.success)throw new Error(c.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Ge(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(d){console.error("saveEditOrder error:",d),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(d?.message||d),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function Oo(t){if(!nt()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}Ue=t,window._pendingDeleteOrderCode=t;let o=document.getElementById("confirmDeleteOrderCode");o&&(o.textContent=t);let a=document.getElementById("confirmDeleteOrderInfo");a&&(a.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let e=document.getElementById("modalConfirmDeleteOrder");e&&e.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let r=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(r.success&&r.data&&a){let{info:s,items:i}=r.data,l=(i||[]).reduce((c,u)=>c+(Number(u.thanhTien)||0),0),d=(i||[]).reduce((c,u)=>c+(Number(u.soLuong)||0),0);a.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${I(s.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${tt(s.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${I(s.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${I(s.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${i.length} m\xF3n (${bt(d)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${A(l)}</span>
          </div>
        </div>
      `}}catch{}}function ae(){let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.add("hidden"),Ue=null,window._pendingDeleteOrderCode=null}async function jo(){let t=Ue||window._pendingDeleteOrderCode;if(t){if(!nt()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),ae();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let a=await(await fetch(`/api/order?orderCode=${encodeURIComponent(t)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t})})).json();if(!a.success)throw new Error(a.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),ae(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(o){console.error("executeDeleteOrder error:",o),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(o?.message||o),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var $=window;$.renderJourneyBadge=te;$.renderHsOrdersList=ee;$.filterHsOrders=qe;$.loadHistory=Io;$.viewOrderDetail=Mo;$.canEditOrders=et;$.canDeleteOrders=nt;$.canAuthenticateJourney=Zt;$.STANDARD_STEPS=ne;$.renderJourneyTimeline=oe;$.openOrderJourneyModal=Bo;$.closeOrderJourneyModal=Ho;$.submitJourneyStep=No;$.openEditOrderModal=Fo;$.closeEditOrderModal=Ge;$.renderEditOrderItems=xt;$.updateEditOrderItemQty=Ro;$.removeEditOrderItemLine=Do;$.addEditOrderItemLine=Ao;$.recalcEditOrderTotals=Qe;$.saveEditOrder=Po;$.confirmDeleteOrder=Oo;$.closeDeleteOrderModal=ae;$.executeDeleteOrder=jo;function ze(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800":"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}function Wo(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800":"bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60"}function Vo(t,o){return t<=0?o<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`${t} ng\xE0y`}function Ko(t,o){return t<=0?o<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`C\xF2n ${t} ng\xE0y`}function Je(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}function Xo(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-gray-900 dark:text-white"}function It(t){return t.batch_code||t.batch_no||t.site_code||"KHO"}function Mt(t){return t.unit||t.uom||"Ph\u1EA7n"}function wt(t){return typeof t=="number"?t:parseFloat(t||"0")||0}function Ye(t){let o=wt(t);return L(o,2)}var O=1,re=10,se="fefo_priority",$t="asc",D=new Set;function qo(){return D}function Uo(){return O}function Go(t){O=t}function Ze(t){let o=document.getElementById("fefoTableBody"),a=document.getElementById("fefoMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=ze(e.danger_level),r=Wo(e.danger_level),s=D.has(e.sku),i=It(e),l=Mt(e),d=e.exp_date?e.exp_date.slice(0,10):"\u2014",c=wt(e.qty),u=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,h=Vo(u,c),g=Je(e.danger_level),y=(e.item_name||"").replace(/'/g,"\\'"),p=e.fefo_priority??1;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${e.sku}" onchange="toggleStockItemSelect('${e.sku}', this.checked)" ${s?"checked":""}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${p}</span>
          </td>
          <td class="p-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${e.sku}')" class="text-brand-500 dark:text-brand-400 hover:underline" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
              ${e.sku}
            </a>
          </td>
          <td class="p-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">${e.item_name}</td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">${i}</span>
          </td>
          <td class="p-3.5 whitespace-nowrap min-w-[130px]">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border ${r}">
              <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0 opacity-70"></i>
              <span>${d}</span>
            </div>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[110px]">
            ${Ye(c)} <span class="font-sans text-xs font-normal text-gray-500">${l}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${g}">${h}</td>
          <td class="p-3.5 text-center whitespace-nowrap min-w-[110px]">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${n}">${e.status_text||"An to\xE0n"}</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap min-w-[120px]">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditItemModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Ch\u1EC9nh s\u1EEDa \u0111\u1ECBnh m\u1EE9c an to\xE0n">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="openIssueModal('${e.sku}', '${y}', '${i}', ${c})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xu\u1EA5t B\u1EBFp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=ze(e.danger_level),r=It(e),s=Mt(e),i=e.exp_date?e.exp_date.slice(0,10):"\u2014",l=wt(e.qty),d=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,c=Ko(d,l),u=Xo(e.danger_level),h=Je(e.danger_level),g=(e.item_name||"").replace(/'/g,"\\'");return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${e.fefo_priority??1}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${e.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${n}">${e.status_text||c}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 SKU</div>
              <div class="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">${e.sku}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 L\xF4 / \u0110i\u1EC3m B\xE1n</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white whitespace-nowrap truncate">${r}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">H\u1EA1n D\xF9ng (EXP)</div>
              <div class="inline-flex items-center gap-1 font-mono font-bold text-xs whitespace-nowrap ${u}">
                <i data-lucide="calendar" class="w-3 h-3 shrink-0 opacity-70"></i>
                <span>${i}</span>
              </div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">T\xECnh Tr\u1EA1ng H\u1EA1n</div>
              <div class="font-mono font-bold text-xs whitespace-nowrap ${h}">${c}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">T\u1ED3n kh\u1EA3 d\u1EE5ng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${l<0?"text-rose-600":"text-brand-500 dark:text-brand-400"}">${Ye(l)} <span class="font-sans text-xs font-normal text-gray-500">${s}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${e.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi ti\u1EBFt</button>
            <button onclick="openIssueModal('${e.sku}', '${g}', '${r}', ${l})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xu\u1EA5t B\u1EBFp</button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function lt(){let t=(document.getElementById("fefoSearchInput")?.value||"").toLowerCase().trim(),o=document.getElementById("fefoCategoryFilter")?.value||"",a=document.getElementById("fefoStatusFilter")?.value||"",n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(y=>{let p=!t||y.sku&&y.sku.toLowerCase().includes(t)||y.item_name&&y.item_name.toLowerCase().includes(t)||y.batch_code&&y.batch_code.toLowerCase().includes(t)||y.batch_no&&y.batch_no.toLowerCase().includes(t),b=!o||y.category===o||!!y.category&&y.category.includes(o),f=!0;return a==="safe"?f=y.danger_level==="green":a==="yellow"?f=y.danger_level==="yellow":a==="red"?f=y.danger_level==="red":a&&(f=y.danger_level===a),p&&b&&f});n.sort((y,p)=>{let b=y[se]??"",f=p[se]??"";return typeof b=="number"&&typeof f=="number"?$t==="asc"?b-f:f-b:$t==="asc"?String(b).localeCompare(String(f)):String(f).localeCompare(String(b))});let r=n.length,s=Math.ceil(r/re)||1;O>s&&(O=s),O<1&&(O=1);let i=(O-1)*re,l=n.slice(i,i+re),d=document.getElementById("stockPageEnd");d&&(d.textContent=String(Math.min(i+re,r)));let c=document.getElementById("stockTotalCount");c&&(c.textContent=String(r));let u=document.getElementById("stockCurrentPageBadge");u&&(u.textContent=`${O}/${s}`);let h=document.getElementById("stockPrevBtn");h&&(h.disabled=O<=1);let g=document.getElementById("stockNextBtn");g&&(g.disabled=O>=s),Ze(l)}function Qo(t){O+=t,lt()}function zo(t){se===t?$t=$t==="asc"?"desc":"asc":(se=t,$t="asc"),lt()}function Jo(){let t=document.getElementById("fefoSearchInput");t&&(t.value="");let o=document.getElementById("fefoCategoryFilter");o&&(o.value="");let a=document.getElementById("fefoStatusFilter");a&&(a.value=""),O=1,lt()}function Yo(t){document.querySelectorAll(".stock-row-checkbox").forEach(a=>{a.checked=t;let e=a.dataset.sku;e&&(t?D.add(e):D.delete(e))}),_t()}function Zo(t,o){o?D.add(t):D.delete(t),_t()}function _t(){let t=document.getElementById("stockBulkActionBar"),o=document.getElementById("selectedStockCount");t&&(D.size>0?(t.classList.remove("hidden"),o&&(o.textContent=String(D.size))):t.classList.add("hidden"))}function ta(){D.clear();let t=document.getElementById("selectAllStockCheckbox");t&&(t.checked=!1),document.querySelectorAll(".stock-row-checkbox").forEach(o=>{o.checked=!1}),_t()}var ie=null;async function de(){try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",a=await(await fetch(`/api/stock?branch=${encodeURIComponent(t)}`)).json();if(a.success){typeof App<"u"&&(App.fefoItems=a.data||[]);let e=document.getElementById("fefoCategoryFilter"),n=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(e&&n.length){let r=e.value,s=Array.from(new Set(n.map(i=>i.category).filter(Boolean))).sort();e.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>'+s.map(i=>`<option value="${i}">${i}</option>`).join(""),r&&s.includes(r)&&(e.value=r)}lt()}}catch(t){console.error("Error loading FEFO stock:",t)}}function ea(){let t=document.getElementById("modalFastReceipt");t&&t.classList.remove("hidden")}function na(t,o,a,e){let n=document.getElementById("issueSku");n&&(n.value=t);let r=document.getElementById("issueBatchLabel");r&&(r.innerHTML=`<b>${t}</b> - ${o} <br>L\xF4: <b>${a}</b> (Kh\u1EA3 d\u1EE5ng: ${e})`);let s=document.getElementById("modalFastIssue");s&&s.classList.remove("hidden")}function Bt(t){let o=document.getElementById(t);o&&o.classList.add("hidden")}async function oa(){typeof showLoading=="function"&&showLoading("\u0110ang ghi nh\u1EADn nh\u1EADp kho...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=document.getElementById("recSku"),a=document.getElementById("recBatch"),e=document.getElementById("recMfg"),n=document.getElementById("recExp"),r=document.getElementById("recQty"),s=document.getElementById("recLoc"),i={branch_code:t,sku:o?o.value:"",batch_code:a&&a.value?a.value:"BAT-"+Date.now().toString().slice(-4),mfg_date:e?e.value:"",exp_date:n?n.value:"",qty:r?r.value:"0",storage_loc:s?s.value:""},d=await(await fetch("/api/stock/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();d.success?(Bt("modalFastReceipt"),typeof showToast=="function"&&showToast("Nh\u1EADp kho l\xF4 m\u1EDBi th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),de()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}async function aa(){typeof showLoading=="function"&&showLoading("\u0110ang th\u1EF1c hi\u1EC7n xu\u1EA5t kho FEFO...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=document.getElementById("issueSku"),a=document.getElementById("issueQty"),e=document.getElementById("issueNote"),n={branch_code:t,sku:o?o.value:"",qty_needed:a?a.value:"0",note:e?e.value:""},s=await(await fetch("/api/stock/issue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();s.success?(Bt("modalFastIssue"),typeof showToast=="function"&&showToast("Xu\u1EA5t kho chu\u1EA9n FEFO th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),de()):typeof showToast=="function"&&showToast("L\u1ED7i: "+s.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function ra(t){let a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===t);if(!a)return;let e=document.getElementById("editItemSku"),n=document.getElementById("editItemName"),r=document.getElementById("editItemSafetyStock"),s=document.getElementById("editItemUnit");e&&(e.value=a.sku),n&&(n.value=`${a.sku} - ${a.item_name}`),r&&(r.value=String(a.safety_stock||5)),s&&(s.value=a.unit||a.uom||"Can 5L");let i=document.getElementById("modalEditItem");i&&i.classList.remove("hidden")}function sa(){let t=document.getElementById("editItemSku"),o=document.getElementById("editItemSafetyStock"),a=document.getElementById("editItemUnit"),e=t?t.value:"",n=o&&parseFloat(o.value)||5,r=a?a.value:"",i=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===e);i&&(i.safety_stock=n,i.unit=r),Bt("modalEditItem"),typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u1ECBnh m\u1EE9c an to\xE0n cho ${e}!`),lt()}async function ia(t){try{let o=document.getElementById("modalInventoryDetail");if(!o)return;o.classList.remove("hidden");let a=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(p=>p.sku===t);if(!n){let b=await(await fetch(`/api/stock?branch=${encodeURIComponent(a)}`)).json();b.success&&b.data&&(n=b.data.find(f=>f.sku===t))}n||(n={sku:t,item_name:t,category:"Gia v\u1ECB",unit:"\u0110\u01A1n v\u1ECB",qty:12,safety_stock:5,standard_cost_sap:185e3,lead_time_hours:24});let r=document.getElementById("detailItemSku");r&&(r.textContent=n.sku);let s=document.getElementById("detailItemName");s&&(s.textContent=n.item_name||n.sku);let i=document.getElementById("detailItemUnit");i&&(i.textContent=n.unit||n.uom||"\u0110\u01A1n v\u1ECB");let l=document.getElementById("detailBadgeCategory");l&&(l.textContent=(n.sku.slice(0,2)||"GV").toUpperCase());let d=document.getElementById("detailQty");d&&(d.textContent=`${n.qty||0} ${n.unit||n.uom||""}`);let c=document.getElementById("detailSafetyStock");c&&(c.textContent=`${n.safety_stock||5} ${n.unit||n.uom||""}`);let u=document.getElementById("detailStandardCost");u&&(u.textContent=S(Number(n.standard_cost_sap)||185e3));let h=document.getElementById("detailLeadTime");h&&(h.textContent=`${n.lead_time_hours||24}h`);let g=document.getElementById("itemDetailStockChart");if(g&&typeof ApexCharts<"u"){ie&&ie.destroy();let p=typeof isDarkModeActive=="function"?isDarkModeActive():!1,f={series:[{name:"T\u1ED3n kho th\u1EF1c t\u1EBF",data:[15,14,16,12,11,14,13,15,14,12,typeof n.qty=="number"?n.qty:parseFloat(String(n.qty))||10]}],colors:["#19723C"],chart:{fontFamily:"'Be Vietnam Pro', sans-serif",type:"area",height:180,toolbar:{show:!1},sparkline:{enabled:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2.5},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.35,opacityTo:.05,stops:[0,95,100]}},xaxis:{categories:["09/11","10/11","11/11","12/11","13/11","14/11","15/11","16/11","17/11","18/11","19/11"],labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},yaxis:{labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},grid:{borderColor:p?"#1E293B":"#F1F5F9",strokeDashArray:3}};ie=new ApexCharts(g,f),ie.render()}let y=document.getElementById("detailTransactionsBody");y&&(y.innerHTML=`
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Ch\u01B0a c\xF3 ph\xE1t sinh giao d\u1ECBch cho m\u1EB7t h\xE0ng n\xE0y.
          </td>
        </tr>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(o){console.error("Error opening item detail:",o)}}function da(t,o,a){let n=[["\u01AFu Ti\xEAn FEFO","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","M\xE3 L\xF4","H\u1EA1n D\xF9ng (EXP)","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n","\u0110\u01A1n V\u1ECB","S\u1ED1 Ng\xE0y C\xF2n","Tr\u1EA1ng Th\xE1i"]];a.forEach(l=>{let d=l.fefo_priority??1,c=l.sku||"",u=l.item_name||"",h=It(l),g=l.exp_date?l.exp_date.slice(0,10):"\u2014",y=wt(l.qty),p=Mt(l),b=l.days_remaining!==void 0?l.days_remaining:l.days_left!==void 0?l.days_left:45,f=l.status_text||"An to\xE0n";n.push([d,c,u,h,g,y,p,b,f])});let r=XLSX.utils.book_new(),s=XLSX.utils.aoa_to_sheet(n),i=XLSX.utils.decode_range(s["!ref"]);s["!cols"]=[{wch:14},{wch:14},{wch:34},{wch:16},{wch:16},{wch:14},{wch:10},{wch:14},{wch:16}];for(let l=i.s.r;l<=i.e.r;++l)for(let d=i.s.c;d<=i.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(s[c])if(l===0)s[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let u="left",h;d===0||d===1||d===3||d===4||d===6||d===8?u="center":(d===5||d===7)&&(u="right",d===5&&(h="#,##0.00"),d===7&&(h="#,##0"));let g=d===5&&typeof s[c].v=="number"&&s[c].v<0;s[c].s={font:{name:"Aptos",sz:11,bold:!1,color:{rgb:g?"C00000":"000000"}},alignment:{horizontal:u,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},h&&(s[c].z=h)}}s["!freeze"]={xSplit:0,ySplit:1},s["!autofilter"]={ref:s["!ref"]},XLSX.utils.book_append_sheet(r,s,o),XLSX.writeFile(r,t)}function la(){let t=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}da("Danh_Sach_Ton_Kho_FEFO.xlsx","TonKhoFEFO",t)}function ca(){if(D.size===0){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t Excel!");return}let o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(a=>D.has(a.sku));da("Ton_Kho_Duoc_Chon.xlsx","DuocChon",o)}if(typeof window<"u"){let t=window;t.renderFefoRows=Ze,t.filterFefoLive=lt,t.changeStockPage=Qo,t.sortStockBy=zo,t.resetFefoFilters=Jo,t.toggleSelectAllStock=Yo,t.toggleStockItemSelect=Zo,t.updateStockBulkBar=_t,t.clearStockSelection=ta,t.selectedStockSkus=D,t.getSelectedStockSkus=qo,t.getStockCurrentPage=Uo,t.setStockCurrentPage=Go,t.loadStockFEFO=de,t.openReceiptModal=ea,t.openIssueModal=na,t.closeModal=Bt,t.submitReceiptToBackend=oa,t.submitIssueToBackend=aa,t.openEditItemModal=ra,t.saveItemSpecs=sa,t.openItemDetailModal=ia,t.exportFefoToExcel=la,t.exportSelectedStockExcel=ca}function tn(t){let o=document.getElementById("ropTableBody"),a=document.getElementById("ropMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n (Kh\xF4ng c\u1EA7n \u0111\u1EB7t th\xEAm).</td></tr>'),a&&(a.innerHTML='<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=e.sku||"",r=e.item_name||n,s=e.unit||e.uom||"Ph\u1EA7n",i=parseFloat(String(e.daily_usage!==void 0?e.daily_usage:10)),l=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,d=parseFloat(String(e.safety_stock!==void 0?e.safety_stock:5)),c=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),u=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),h=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:c<u?Math.max(0,35-c):0)),g=e.status||(c<=0?"H\u1EBET H\xC0NG":c<u?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),y="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold";return g==="H\u1EBET H\xC0NG"?y="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold":g==="C\u1EA6N \u0110\u1EB6T"&&(y="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold animate-pulse"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs">${n}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${r}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${L(i,1)} <span class="text-[11px] text-gray-400 font-sans">${s}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${l} ng\xE0y</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${L(d,1)} <span class="text-[11px] text-gray-400 font-sans">${s}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${c<=0?"text-rose-600":"text-gray-900 dark:text-white"} text-xs">${L(c,1)} <span class="text-[11px] text-gray-400 font-sans">${s}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs">${L(u,1)} <span class="text-[11px] text-amber-600/70 font-sans">${s}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${h>0?"text-brand-600 dark:text-brand-400":"text-gray-400"} text-xs">${h>0?"+"+L(h,1):"0"} <span class="text-[11px] text-gray-400 font-sans">${s}</span></td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] ${y}">${g}</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=e.sku||"",r=e.item_name||n,s=e.unit||e.uom||"Ph\u1EA7n",i=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,l=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),d=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),c=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:l<d?Math.max(0,35-l):0)),u=e.status||(l<=0?"H\u1EBET H\xC0NG":l<d?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),h="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200";return u==="H\u1EBET H\xC0NG"?h="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200":u==="C\u1EA6N \u0110\u1EB6T"&&(h="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${r}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${n}</div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${h}">${u}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>T\u1ED3n hi\u1EC7n t\u1EA1i: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${L(l,1)} ${s}</b></div>
            <div>\u0110i\u1EC3m ROP: <b class="font-mono tabular-nums text-amber-600 dark:text-amber-400">${L(d,1)} ${s}</b></div>
            <div>Lead time: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i} ng\xE0y</b></div>
            <div>\u0110\u1EC1 xu\u1EA5t \u0111\u1EB7t: <b class="font-mono tabular-nums font-semibold text-sm ${c>0?"text-brand-600 dark:text-brand-400":"text-gray-500"}">${c>0?"+"+L(c,1):"0"} ${s}</b></div>
          </div>
        </div>
      `}).join(""))}async function ua(){let t=localStorage.getItem("orbit_user_site"),o=document.getElementById("globalBranchSelect")?.value,a=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,e=t||o||a||"K001";(e==="ALL"||e==="all")&&(e="K001"),e=e.toUpperCase();let n=document.getElementById("whRopCurrentSiteBadge");if(n){let l=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(d=>d.code&&d.code.toUpperCase()===e.toUpperCase());n.textContent=l?l.ten||l.name:e}let r=document.getElementById("ropTableBody"),s=document.getElementById("ropMobileCards");r&&(r.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</td></tr>'),s&&(s.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</div>');try{let l=await(await fetch(`/api/reorder?site=${encodeURIComponent(e)}&branch=${encodeURIComponent(e)}&nocache=1`)).json();if(l.success){let d=l.data||[];typeof App<"u"&&(App.ropItems=d),tn(d)}else r&&(r.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`),s&&(s.innerHTML=`<div class="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">L\u1ED7i: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</div>`)}catch(i){console.error("loadReorderROP error:",i),r&&(r.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${i.message}</td></tr>`)}}function le(t){let o=document.getElementById("leadTimeTableBody"),a=document.getElementById("leadTimeMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="7" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",r=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),s=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),i=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",l=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),d=l==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",c=l==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",u=d?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":c?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono tabular-nums font-bold text-gray-900 dark:text-white">${e.po_number}</td>
          <td class="p-3 font-mono tabular-nums font-bold text-brand-600 dark:text-brand-400">
            <span class="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">${e.branch_code||e.site||"\u2014"}</span>
          </td>
          <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${n}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${r}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${s}</td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${!d&&!c?"text-rose-600":"text-emerald-600"}">${i}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${u}">${l}</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",r=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),s=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),i=e.committed_lead_time_days?e.committed_lead_time_days+" ng\xE0y":e.sla_target_hours?e.sla_target_hours+"h":"24h",l=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",d=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),c=d==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",u=d==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",h=c?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":u?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">${n}</div>
              <div class="text-xs font-mono tabular-nums text-gray-400">PO: ${e.po_number} \xB7 \u0110i\u1EC3m: <b class="text-brand-600 dark:text-brand-400">${e.branch_code||e.site||"\u2014"}</b></div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${h}">${d}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${r}</b></div>
            <div>Ng\xE0y nh\u1EADn: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s}</b></div>
            <div>Cam k\u1EBFt SLA: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i}</b></div>
            <div>Lead time th\u1EF1c t\u1EBF: <b class="font-mono tabular-nums font-bold ${!c&&!u?"text-rose-600":"text-emerald-600"}">${l}</b></div>
          </div>
        </div>
      `}).join(""))}function en(t){let o=typeof App<"u"&&App.leadTimeRawData?App.leadTimeRawData:[];if(!t||t==="ALL"){le(o);return}let a=o.filter(e=>{let n=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N");return t==="ON_TIME"?n==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA":t==="DELIVERING"?n==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao":t==="LATE"?n==="TR\u1EC4 H\u1EA0N"||e.sla_status==="Tr\u1EC5 h\u1EB9n NCC":!0});le(a)}async function pa(){let t=document.getElementById("globalBranchSelect")?.value,a=((typeof App<"u"&&App.currentBranch?App.currentBranch:"")||t||"").toUpperCase(),e=document.getElementById("leadTimeMonth")?.value||"",n=new URLSearchParams;a&&a!=="ALL"&&n.set("site",a),e&&n.set("month",e);let r=n.toString()?`/api/leadtime?${n.toString()}`:"/api/leadtime";try{let i=await(await fetch(r)).json(),l=i.success&&i.data?i.data:[];typeof App<"u"&&(App.leadTimeRawData=l);let d=document.getElementById("leadTimeSlaFilter")?.value||"ALL";en(d)}catch(s){console.error("Error loading Lead Time:",s)}}function ga(){let t=typeof App<"u"&&App.ropItems?App.ropItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u c\u1EA3nh b\xE1o ROP \u0111\u1EC3 xu\u1EA5t Excel!");return}let a=[["M\xE3 SKU","T\xEAn Gia V\u1ECB / M\u1EB7t H\xE0ng","\u0110VT","Ti\xEAu Th\u1EE5/Ng\xE0y","Lead Time (ng\xE0y)","T\u1ED3n An To\xE0n","T\u1ED3n Hi\u1EC7n T\u1EA1i","Ng\u01B0\u1EE1ng ROP","\u0110\u1EC1 Xu\u1EA5t \u0110\u1EB7t","Tr\u1EA1ng Th\xE1i"]];t.forEach(s=>{let i=s.sku||"",l=s.item_name||i,d=s.unit||s.uom||"Ph\u1EA7n",c=parseFloat(String(s.daily_usage!==void 0?s.daily_usage:10)),u=s.lead_time_days!==void 0?parseFloat(String(s.lead_time_days)):s.lead_time_hours?Math.round(parseFloat(String(s.lead_time_hours))/24):2,h=parseFloat(String(s.safety_stock!==void 0?s.safety_stock:5)),g=parseFloat(String(s.current_stock!==void 0?s.current_stock:0)),y=parseFloat(String(s.rop!==void 0?s.rop:s.rop_threshold!==void 0?s.rop_threshold:25)),p=parseFloat(String(s.suggested_order!==void 0?s.suggested_order:s.suggested_order_qty!==void 0?s.suggested_order_qty:g<y?Math.max(0,35-g):0)),b=s.status||(g<=0?"H\u1EBET H\xC0NG":g<y?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N");a.push([i,l,d,c,u,h,g,y,p,b])});let e=XLSX.utils.book_new(),n=XLSX.utils.aoa_to_sheet(a),r=XLSX.utils.decode_range(n["!ref"]);n["!cols"]=[{wch:14},{wch:34},{wch:10},{wch:14},{wch:16},{wch:14},{wch:14},{wch:14},{wch:14},{wch:16}];for(let s=r.s.r;s<=r.e.r;++s)for(let i=r.s.c;i<=r.e.c;++i){let l=XLSX.utils.encode_cell({r:s,c:i});if(n[l])if(s===0)n[l].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let d="left",c;i===0||i===2||i===9?d="center":i>=3&&i<=8&&(d="right",c="#,##0.0",(i===4||i===8)&&(c="#,##0"));let u=i===6&&typeof n[l].v=="number"&&n[l].v<=0;n[l].s={font:{name:"Aptos",sz:11,bold:i===6||i===8,color:{rgb:u?"C00000":"000000"}},alignment:{horizontal:d,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},c&&(n[l].z=c)}}n["!freeze"]={xSplit:0,ySplit:1},n["!autofilter"]={ref:n["!ref"]},XLSX.utils.book_append_sheet(e,n,"ROP"),XLSX.writeFile(e,"De_Xuat_Dat_Hang_ROP.xlsx")}if(typeof window<"u"){let t=window;t.loadReorderROP=ua,t.renderRopTable=tn,t.loadLeadTime=pa,t.renderLeadTimeTable=le,t.filterLeadTimeSla=en,t.downloadRopExcel=ga}function nn(t){let o=t?"#94A3B8":"#64748B",a=t?"#1E293B":"#F1F5F9";if(typeof chartInboundOutbound<"u"&&chartInboundOutbound)try{chartInboundOutbound.updateOptions({chart:{foreColor:o},grid:{borderColor:a},xaxis:{labels:{style:{colors:o}}},yaxis:{labels:{style:{colors:o}}},tooltip:{theme:t?"dark":"light"}})}catch{}if(typeof chartSafetyGauge<"u"&&chartSafetyGauge)try{chartSafetyGauge.updateOptions({plotOptions:{radialBar:{track:{background:t?"#1C243D":"#E8EAEE"},dataLabels:{value:{color:t?"#FFFFFF":"#1D2939"}}}}})}catch{}if(typeof chartValueTrend<"u"&&chartValueTrend)try{chartValueTrend.updateOptions({chart:{foreColor:o},grid:{borderColor:a},xaxis:{labels:{style:{colors:o}}},yaxis:{labels:{style:{colors:o}}}})}catch{}}function on(t){let o=document.getElementById("stockAlertsTableBody"),a=document.getElementById("dashStockAlertsMobileCards");if(!o&&!a)return;if(!t||t.length===0){o&&(o.innerHTML=`
        <tr>
          <td colspan="7" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500 inline-block mb-1"></i>
            <p class="font-medium text-xs">Hi\u1EC7n t\u1EA1i kh\xF4ng c\xF3 c\u1EA3nh b\xE1o vi ph\u1EA1m an to\xE0n kho!</p>
          </td>
        </tr>
      `),a&&(a.innerHTML=`
        <div class="card p-6 text-center text-gray-400 dark:text-gray-500">
          <i data-lucide="check-circle" class="w-6 h-6 text-emerald-500 mx-auto mb-2"></i>
          <p class="font-medium text-sm">Hi\u1EC7n t\u1EA1i kh\xF4ng c\xF3 c\u1EA3nh b\xE1o vi ph\u1EA1m an to\xE0n kho!</p>
        </div>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();return}o&&(o.innerHTML=t.map(n=>{let r="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40",s="B\xECnh th\u01B0\u1EDDng";return n.alert_level==="OUT_OF_STOCK"?(r="bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold",s="H\u1EBFt h\xE0ng"):n.alert_level==="NEAR_EXPIRY"?(r="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold",s=`C\u1EADn Date (${n.days_left||0}d)`):n.alert_level==="LOW_STOCK"&&(r="bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40 font-bold",s="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <tr class="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors">
          <td class="px-5 py-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${n.sku}')" class="text-brand-500 hover:underline flex items-center gap-1">
              ${n.sku}
            </a>
          </td>
          <td class="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[160px]">
            <div>${n.item_name||n.sku}</div>
            <span class="text-xs text-gray-400 font-normal">${n.category||"Gia v\u1ECB"} \u2022 ${n.unit||"\u0110\u01A1n v\u1ECB"}</span>
          </td>
          <td class="px-5 py-3.5 whitespace-nowrap min-w-[155px]">
            <div class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">${n.batch_code||"L\xF4 kho"}</div>
            <div class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
              <i data-lucide="calendar" class="w-3 h-3 shrink-0"></i>
              <span>EXP: ${n.exp_date?n.exp_date.slice(0,10):"Ch\u01B0a c\xF3"}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            ${n.qty} ${n.unit||""}
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            ${n.safety_stock||5} ${n.unit||""}
          </td>
          <td class="px-5 py-3.5 text-center whitespace-nowrap">
            <span class="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${r}">
              ${s}
            </span>
          </td>
          <td class="px-5 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${n.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openReceiptModal('${n.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Nh\u1EADp b\u1ED5 sung">
                <i data-lucide="package-plus" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(n=>{let r="badge-neutral",s="B\xECnh th\u01B0\u1EDDng";return n.alert_level==="OUT_OF_STOCK"?(r="badge-danger",s="H\u1EBFt h\xE0ng"):n.alert_level==="NEAR_EXPIRY"?(r="badge-warning",s=`C\u1EADn Date (${n.days_left||0}d)`):n.alert_level==="LOW_STOCK"&&(r="badge-warning",s="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${m(n.sku||"")}</span>
              <span class="badge ${r}">${s}</span>
            </div>
            <span class="text-xs text-gray-400">${m(n.batch_code||"L\xF4 kho")}</span>
          </div>
          <div class="data-card-body space-y-1.5">
            <div class="font-semibold text-sm text-gray-900 dark:text-white">${m(n.item_name||n.sku||"")}</div>
            <div class="text-xs text-gray-400">${m(n.category||"Gia v\u1ECB")} \u2022 ${m(n.unit||"\u0110VT")}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">T\u1ED3n hi\u1EC7n t\u1EA1i:</span>
                <span class="num font-semibold text-gray-900 dark:text-white ml-1">${n.qty} ${m(n.unit||"")}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">An to\xE0n:</span>
                <span class="num font-semibold text-amber-600 dark:text-amber-400 ml-1">${n.safety_stock||5} ${m(n.unit||"")}</span>
              </div>
            </div>
            ${n.exp_date?`
              <div class="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 pt-1">
                <span>H\u1EA1n d\xF9ng:</span>
                <span class="num font-medium">${z(n.exp_date.slice(0,10))}</span>
              </div>
            `:""}
          </div>
          <div class="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openItemDetailModal('${n.sku}')" class="btn btn-secondary btn-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
            </button>
            <button onclick="openReceiptModal('${n.sku}')" class="btn btn-primary btn-sm">
              <i data-lucide="package-plus" class="w-3.5 h-3.5"></i> Nh\u1EADp b\u1ED5 sung
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();let e=document.documentElement.classList.contains("dark");nn(e)}function an(t){typeof renderKpi=="function"&&(renderKpi("dashMetricValue",{value:t.total_value||0,sub:"Theo gi\xE1 b\xECnh qu\xE2n kho"}),renderKpi("dashMetricSkus",{value:t.total_skus||0,unit:"M\xE3",isCurrency:!1,sub:"To\xE0n b\u1ED9 danh m\u1EE5c kho"}),renderKpi("dashMetricRop",{value:t.rop_reorder_count||0,unit:"M\xE3",isCurrency:!1,deltaText:(t.rop_reorder_count||0)>0?`${t.rop_reorder_count} m\xE3 c\u1EA7n \u0111\u1EB7t`:"An to\xE0n",deltaGood:(t.rop_reorder_count||0)===0,sub:"Ch\u1EA1m ng\u01B0\u1EE1ng an to\xE0n"}),renderKpi("dashMetricExp",{value:t.critical_exp_count||0,unit:"L\xF4",isCurrency:!1,deltaText:(t.critical_exp_count||0)>0?`${t.critical_exp_count} l\xF4 xu\u1EA5t g\u1EA5p`:"An to\xE0n",deltaGood:(t.critical_exp_count||0)===0,sub:"\u01AFu ti\xEAn xu\u1EA5t FEFO"}),renderKpi("dashMetricSlow",{value:t.slow_moving_count!==void 0?t.slow_moving_count:0,unit:"M\xE3",isCurrency:!1,sub:"L\u01B0u kho kh\xF4ng bi\u1EBFn \u0111\u1ED9ng"}));let o=document.getElementById("dashLeadTimeText");if(o&&(o.textContent=`${t.avg_lead_time||24.5}h`),typeof chartSafetyGauge<"u"&&chartSafetyGauge&&typeof t.safety_rate<"u")try{chartSafetyGauge.updateSeries([parseFloat(String(t.safety_rate))])}catch{}if(typeof chartInboundOutbound<"u"&&chartInboundOutbound&&t.chart_inbound_outbound){let a=t.chart_inbound_outbound,e=Array.isArray(a.categories)?a.categories:String(a.categories||"").split(" ").filter(Boolean),n=Array.isArray(a.inbound)?a.inbound:String(a.inbound||"").split(" ").filter(Boolean).map(Number),r=Array.isArray(a.outbound)?a.outbound:String(a.outbound||"").split(" ").filter(Boolean).map(Number);if(e.length)try{chartInboundOutbound.updateOptions({xaxis:{categories:e}}),chartInboundOutbound.updateSeries([{name:"Nh\u1EADp kho (Tr \u20AB)",data:n},{name:"Xu\u1EA5t kho (Tr \u20AB)",data:r}])}catch(s){console.warn("Chart update notice:",s)}}on(t.alerts||[])}async function ma(){try{let t=(typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL").toUpperCase(),o=document.getElementById("dashBranchTitle");o&&(o.textContent=t&&t!=="ALL"?t:"To\xE0n Chu\u1ED7i");let e=await(await fetch(`/api/dashboard-summary?branch=${encodeURIComponent(t)}&refresh=true`)).json();if(e.success){let n=e.data;an(n);let r=document.getElementById("dashCritCount");r&&(r.textContent=String(n.critical_exp_count||0));let s=document.getElementById("dashRopCount");s&&(s.textContent=String(n.rop_reorder_count||0));let i=document.getElementById("dashLeadTime");i&&(i.textContent=`${n.avg_lead_time||24.5}h`);let l=document.getElementById("dashTotalQty");l&&(l.textContent=L(n.total_qty||0,1));let d=document.getElementById("dashTotalSkus");d&&(d.textContent=`${n.total_skus||0} SKU \u0111ang qu\u1EA3n l\xFD`);let c=document.getElementById("badgeCritNav");c&&(c.textContent=String(n.critical_exp_count||0));let u=document.getElementById("badgeRopNav");u&&(u.textContent=String(n.rop_reorder_count||0))}}catch(t){console.error("Error loading dashboard summary:",t)}}if(typeof window<"u"){let t=window;t.loadDashboardSummary=ma,t.updateTailadminDashboard=an,t.renderStockAlertsTable=on,t.updateApexChartsTheme=nn}var j=[],ct=[];function Qi(){return j}function zi(){return ct}function rn(){let t=(document.getElementById("whInvSearchInput")?.value||"").toLowerCase().trim(),o=document.getElementById("whInvCategorySelect")?.value||"",a=document.getElementById("whInvStatusSelect")?.value||"ALL",e=[...j];t&&(e=e.filter(b=>b.sku&&b.sku.toLowerCase().includes(t)||b.name&&b.name.toLowerCase().includes(t))),o&&(e=e.filter(b=>b.category===o)),a==="HAS_RECEIPT"?e=e.filter(b=>parseFloat(String(b.receipt_qty||0))>0):a==="IN_STOCK"?e=e.filter(b=>parseFloat(String(b.book_qty||0))>0):a==="HAS_BATCH"?e=e.filter(b=>parseInt(String(b.batch_count||0),10)>0):a==="NEGATIVE"&&(e=e.filter(b=>parseFloat(String(b.book_qty||0))<0)),ct=e,typeof window<"u"&&(window.gWhFilteredInventory=e);let n=0,r=0,s=0,i=0;e.forEach(b=>{n+=parseFloat(String(b.receipt_qty||0)),r+=parseFloat(String(b.book_qty||0)),s+=parseFloat(String(b.total_value||0)),i+=parseInt(String(b.batch_count||0),10)});let l=document.getElementById("whKpiTotalSkus");l&&(l.textContent=L(e.length,0));let d=document.getElementById("whKpiTotalReceiptQty");d&&(d.textContent=L(Math.round(n*10)/10,1));let c=document.getElementById("whKpiTotalBookQty");c&&(c.textContent=L(Math.round(r*10)/10,1));let u=document.getElementById("whKpiTotalValue");u&&(u.textContent=S(s));let h=document.getElementById("whKpiTotalBatches");h&&(h.textContent=L(i,0));let g=document.getElementById("whInvRowCount");g&&(g.textContent=L(e.length,0));let y=document.getElementById("whInventoryTableBody"),p=document.getElementById("whInventoryMobileCards");if(!e.length){y&&(y.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>'),p&&(p.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</div>');return}y&&(y.innerHTML=e.map((b,f)=>{let x=parseFloat(String(b.receipt_qty||0)),w=parseFloat(String(b.book_qty||0)),v=parseInt(String(b.batch_count||0),10),T="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return w<0?T="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80":w>0&&(T="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="px-2 py-2 text-center text-gray-400 tabular-nums font-mono">${f+1}</td>
          <td class="px-2 py-2 whitespace-nowrap">
            <button onclick="openWhItemHistoryModal('${b.sku}')" class="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" title="Xem th\u1EBB kho chi ti\u1EBFt">
              <span>${b.sku}</span>
              <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
            </button>
          </td>
          <td class="px-2 py-2 font-semibold text-gray-900 dark:text-white min-w-[150px]">
            <div class="line-clamp-2">${b.name||b.sku}</div>
          </td>
          <td class="px-2 py-2 whitespace-nowrap text-center">
            <span class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200/60 dark:border-gray-700/60 inline-block max-w-[110px] truncate" title="${b.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}">${b.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</span>
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap font-medium text-gray-600 dark:text-gray-300">${b.unit||"Ph\u1EA7n"}</td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/10">
            <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 tabular-nums">
              ${L(x,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/10">
            <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded-md tabular-nums ${T}">
              ${L(w,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
            ${S(Number(b.unit_price)||0)}
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
            ${S(Number(b.total_value)||0)}
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap">
            <button onclick="openWhItemBatchesModal('${b.sku}')" class="px-1.5 py-0.5 rounded-lg text-xs font-semibold font-mono transition-all ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 border border-purple-200/80 dark:border-purple-800/80":"bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600"}" title="Xem chi ti\u1EBFt c\xE1c l\xF4 h\xE0ng">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </td>
          <td class="px-2 py-2 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="openWhItemHistoryModal('${b.sku}')" class="px-1.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-0.5 transition-all" title="Xem th\u1EBB kho l\u1ECBch s\u1EED xu\u1EA5t nh\u1EADp">
                <i data-lucide="history" class="w-3 h-3"></i> Th\u1EBB Kho
              </button>
              <button onclick="openWhItemBatchesModal('${b.sku}')" class="px-1.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800/60 flex items-center gap-0.5 transition-all" title="Xem chi ti\u1EBFt c\xE1c l\xF4 \u0111\xE3 nh\u1EADp">
                <i data-lucide="layers" class="w-3 h-3"></i> L\xF4
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),p&&(p.innerHTML=e.map((b,f)=>{let x=parseFloat(String(b.receipt_qty||0)),w=parseFloat(String(b.book_qty||0)),v=parseInt(String(b.batch_count||0),10);return`
        <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs font-mono">#${f+1}</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b.sku}</span>
                <span class="px-1.5 py-0.2 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${b.unit||"Ph\u1EA7n"}</span>
              </div>
              <h4 class="font-bold text-xs text-gray-900 dark:text-white mt-1 leading-snug">${b.name||b.sku}</h4>
              <div class="text-xs text-gray-500 mt-0.5">${b.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</div>
            </div>
            <button onclick="openWhItemBatchesModal('${b.sku}')" class="px-2 py-1 rounded-lg text-xs font-bold font-mono ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300":"bg-gray-100 text-gray-400 dark:bg-gray-800"}">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 text-xs border border-gray-100 dark:border-gray-800">
            <div>
              <span class="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">\u0110\xE3 Nh\u1EADp Kho</span>
              <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${L(x,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">T\u1ED3n S\u1ED5 S\xE1ch</span>
              <span class="font-mono font-bold tabular-nums ${w<0?"text-rose-600":"text-gray-900 dark:text-white"}">${L(w,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Gi\xE1 Tr\u1ECB T\u1ED3n</span>
              <span class="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums text-xs">${S(Number(b.total_value)||0)}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="openWhItemHistoryModal('${b.sku}')" class="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="history" class="w-3.5 h-3.5"></i> Th\u1EBB Kho Xu\u1EA5t Nh\u1EADp
            </button>
            <button onclick="openWhItemBatchesModal('${b.sku}')" class="w-full py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Chi Ti\u1EBFt L\xF4 H\xE0ng
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}async function sn(){let t=document.getElementById("whInvSiteSelect"),o=localStorage.getItem("orbit_user_site"),a=document.getElementById("globalBranchSelect")?.value,e=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,n=o||a||e||(t?t.value:null)||"K001";if((n==="ALL"||n==="all")&&(n="K001"),n=n.toUpperCase(),t){if(!t.options||t.options.length<=1){let d=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];t.innerHTML=d.map(c=>`<option value="${c.code}">${c.ten||c.name}</option>`).join("")}t.value=n}let r=document.getElementById("whInvCurrentSiteBadge");if(r){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(u=>u.code&&u.code.toUpperCase()===n.toUpperCase());r.textContent=c?c.ten||c.name:n}let s=n,i=document.getElementById("whInventoryTableBody"),l=document.getElementById("whInventoryMobileCards");i&&(i.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</td></tr>'),l&&(l.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</div>');try{let c=await(await fetch(`/api/wh/inventory?site=${encodeURIComponent(s)}&nocache=1`)).json();if(c.success){j=c.data||[],typeof window<"u"&&(window.gWhInventoryData=j);let u=document.getElementById("whInvCategorySelect");if(u){let h=u.value,g=Array.from(new Set(j.map(y=>y.category).filter(Boolean))).sort();u.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m ng\xE0nh</option>'+g.map(y=>`<option value="${y}">${y}</option>`).join(""),h&&g.includes(h)&&(u.value=h)}rn()}else i&&(i.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${c.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`)}catch(d){console.error("loadWhInventory error:",d),i&&(i.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${d.message}</td></tr>`)}}var ot=null,Ht=null;function td(){return ot}function ed(){return Ht}async function fa(t){let o=(j||[]).find(u=>u.sku===t)||{sku:t,name:t,unit:"Ph\u1EA7n"},a=document.getElementById("whInvSiteSelect"),e=a?a.value:"ALL",n=document.getElementById("histItemSku");n&&(n.textContent=o.sku);let r=document.getElementById("histItemName");r&&(r.textContent=o.name||o.sku);let s=document.getElementById("histItemUnit");s&&(s.textContent=o.unit||"Ph\u1EA7n");let i=document.getElementById("histItemSite");i&&(i.textContent=e==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":e);let l=document.getElementById("modalWhItemHistory");l&&l.classList.remove("hidden");let d=document.getElementById("whHistTableBody"),c=document.getElementById("whHistMobileCards");d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">\u0110ang truy xu\u1EA5t th\u1EBB kho t\u1EEB h\u1EC7 th\u1ED1ng...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy xu\u1EA5t th\u1EBB kho...</div>');try{let h=await(await fetch(`/api/wh/item-history?sku=${encodeURIComponent(t)}&site=${encodeURIComponent(e)}&nocache=1`)).json();if(h.success){ot=h.data,typeof window<"u"&&(window.gWhActiveHistory=ot);let g=h.data.history||[],y=document.getElementById("histTotalIn");y&&(y.textContent=L(h.data.total_in||0,1));let p=document.getElementById("histTotalOut");p&&(p.textContent=L(h.data.total_out||0,1));let b=document.getElementById("histRowCount");if(b&&(b.textContent=L(g.length,0)),!g.length){d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o cho m\xE3 h\xE0ng n\xE0y t\u1EA1i \u0111i\u1EC3m \u0111\xE3 ch\u1ECDn.</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o.</div>');return}d&&(d.innerHTML=g.map(f=>{let x=parseFloat(String(f.qty_in||0)),w=parseFloat(String(f.qty_out||0)),v="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return f.trans_type==="NHAP_KHO"?v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200":f.trans_type==="XUAT_HUY"?v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200":f.trans_type==="DIEU_CHUYEN"?v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200":f.trans_type==="XUAT_KHO"&&(v="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"),`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums text-gray-600 dark:text-gray-300">${f.doc_date?String(f.doc_date).split("T")[0]:"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white">${f.doc_no||"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${f.trans_name||f.trans_type}</span>
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-300">
                ${f.batch_code?`<b class="text-purple-600 dark:text-purple-400">${f.batch_code}</b>`:"\u2014"}
                ${f.exp_date?`<span class="text-gray-400 block text-xs">HSD: ${String(f.exp_date).split("T")[0]}</span>`:""}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${x>0?`+${L(x,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                ${w>0?`-${L(w,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${S(Number(f.unit_price)||0)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
                ${S(Number(f.amount)||0)}
              </td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300 max-w-[150px] truncate" title="${f.partner_name||""}">
                ${f.partner_name||"\u2014"}
              </td>
              <td class="p-2.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title="${f.notes||""}">
                ${f.notes||"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=g.map(f=>{let x=parseFloat(String(f.qty_in||0)),w=parseFloat(String(f.qty_out||0)),v=f.doc_date?String(f.doc_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="font-mono font-bold text-gray-900 dark:text-white">${f.doc_no||"\u2014"}</div>
                <span class="text-xs text-gray-400 font-mono">${v}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">${f.trans_name||f.trans_type}</span>
                <span class="font-mono font-bold ${x>0?"text-emerald-600":"text-rose-600"}">
                  ${x>0?`+${L(x,1)}`:`-${L(w,1)}`} ${o.unit||""}
                </span>
              </div>
              ${f.batch_code?`<div class="text-xs text-purple-600 dark:text-purple-400 font-mono">L\xF4: <b>${f.batch_code}</b> ${f.exp_date?"\u2022 HSD: "+String(f.exp_date).split("T")[0]:""}</div>`:""}
              ${f.partner_name?`<div class="text-xs text-gray-500">\u0110\u1ED1i t\xE1c: ${f.partner_name}</div>`:""}
              ${f.notes?`<div class="text-xs text-gray-400 italic">${f.notes}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i: ${h.error}</td></tr>`)}catch(u){console.error("openWhItemHistoryModal error:",u),d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}async function ha(t){let o=(j||[]).find(u=>u.sku===t)||{sku:t,name:t,unit:"Ph\u1EA7n"},a=document.getElementById("whInvSiteSelect"),e=a?a.value:"ALL",n=document.getElementById("batchItemSku");n&&(n.textContent=o.sku);let r=document.getElementById("batchItemName");r&&(r.textContent=o.name||o.sku);let s=document.getElementById("batchItemUnit");s&&(s.textContent=o.unit||"Ph\u1EA7n");let i=document.getElementById("batchItemSite");i&&(i.textContent=e==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":e);let l=document.getElementById("modalWhItemBatches");l&&l.classList.remove("hidden");let d=document.getElementById("whBatchesTableBody"),c=document.getElementById("whBatchesMobileCards");d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">\u0110ang truy v\u1EA5n danh s\xE1ch l\xF4 date FEFO...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy v\u1EA5n l\xF4 date...</div>');try{let h=await(await fetch(`/api/wh/item-batches?sku=${encodeURIComponent(t)}&site=${encodeURIComponent(e)}&nocache=1`)).json();if(h.success){Ht=h.data,typeof window<"u"&&(window.gWhActiveBatches=Ht);let g=h.data.batches||[],y=0,p=0;g.forEach(w=>{w.status==="GOOD"?y++:p++});let b=document.getElementById("batchTotalCount");b&&(b.textContent=L(g.length,0));let f=document.getElementById("batchSafeCount");f&&(f.textContent=L(y,0));let x=document.getElementById("batchWarnCount");if(x&&(x.textContent=L(p,0)),!g.length){d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho m\xE3 n\xE0y (\u0111ang qu\u1EA3n l\xFD t\u1ED3n g\u1ED9p theo site).</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t.</div>');return}d&&(d.innerHTML=g.map(w=>{let v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200",T="C\xF2n h\u1EA1n an to\xE0n";w.status==="EXPIRED"?(v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200",T="\u0110\xE3 h\u1EBFt h\u1EA1n"):w.status==="NEAR_EXPIRY"&&(v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200",T="C\u1EADn date (\u2264 30 ng\xE0y)");let E=w.exp_date?String(w.exp_date).split("T")[0]:"\u2014",_=w.days_left!==999?`${w.days_left} ng\xE0y`:"\u2014";return`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 whitespace-nowrap font-mono font-bold text-purple-700 dark:text-purple-400">${w.batch_code||"L\xD4-CHUNG"}</td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300">
                <span>${w.site_code||""}</span> \u2022 <span class="text-gray-400">${w.storage_loc||"K\u1EC7 B\u1EBFp"}</span>
              </td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono font-semibold text-gray-800 dark:text-gray-200 tabular-nums">${E}</td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums font-semibold ${w.status==="EXPIRED"?"text-rose-600":w.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                ${_}
              </td>
              <td class="p-2.5 text-center whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${T}</span>
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${L(Number(w.initial_qty)||0,1)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                ${L(Number(w.current_qty)||0,1)}
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-gray-500 text-xs">
                ${w.receipt_code?`<span class="text-brand-600 font-semibold">${w.receipt_code}</span>`:"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=g.map(w=>{let v=w.exp_date?String(w.exp_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-purple-700 dark:text-purple-400">L\xF4: ${w.batch_code||"L\xD4-CHUNG"}</span>
                <span class="font-mono font-semibold text-xs ${w.status==="EXPIRED"?"text-rose-600":w.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                  ${w.days_left!==999?`C\xF2n ${w.days_left} ng\xE0y`:""}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>H\u1EA1n d\xF9ng: <b class="font-mono text-gray-900 dark:text-white">${v}</b></div>
                <div>V\u1ECB tr\xED: <b class="text-gray-900 dark:text-white">${w.storage_loc||"K\u1EC7 B\u1EBFp"}</b></div>
                <div>SL Nh\u1EADp: <b class="font-mono text-gray-900 dark:text-white">${L(Number(w.initial_qty)||0,1)}</b></div>
                <div>SL T\u1ED3n: <b class="font-mono font-bold text-blue-600 dark:text-blue-400">${L(Number(w.current_qty)||0,1)}</b></div>
              </div>
              ${w.receipt_code?`<div class="text-xs text-gray-400">Ch\u1EE9ng t\u1EEB: ${w.receipt_code}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i: ${h.error}</td></tr>`)}catch(u){console.error("openWhItemBatchesModal error:",u),d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}var at=[],rt=null;function ad(){return at}function ya(t){let o=document.getElementById("whInvTabBtnBalance"),a=document.getElementById("whInvTabBtnReceipts"),e=document.getElementById("whInvBalanceView"),n=document.getElementById("whInvReceiptsView");t==="balance"?(o&&(o.className="btn btn-primary btn-sm"),a&&(a.className="btn btn-secondary btn-sm"),e&&e.classList.remove("hidden"),n&&n.classList.add("hidden")):(o&&(o.className="btn btn-secondary btn-sm"),a&&(a.className="btn btn-primary btn-sm"),e&&e.classList.add("hidden"),n&&n.classList.remove("hidden"),ue()),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function dn(){let t=document.getElementById("whReceivedOrdersSiteFilter");if(!t||t.options&&t.options.length>1)return;let o=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];t.innerHTML=o.map(e=>`<option value="${e.code}">${e.ten||e.name}</option>`).join("");let a=localStorage.getItem("orbit_user_site")||(typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():"K001");a&&(t.value=a.toUpperCase())}function ce(){let t=document.getElementById("whReceivedOrdersTableBody"),o=document.getElementById("whReceivedOrdersMobileCards"),a=(document.getElementById("whReceivedOrdersSearchInput")?.value||"").trim().toLowerCase(),e=document.getElementById("whReceivedOrdersTypeFilter")?.value||"ALL",n=[...at];e!=="ALL"&&(n=n.filter(u=>u.doc_type===e)),a&&(n=n.filter(u=>(u.po_number||"").toLowerCase().includes(a)||(u.receipt_code||"").toLowerCase().includes(a)||(u.supplier||"").toLowerCase().includes(a)||(u.site_code||"").toLowerCase().includes(a)||(u.notes||"").toLowerCase().includes(a)||(u.created_by||"").toLowerCase().includes(a)));let r=document.getElementById("whKpiReceivedOrdersCount"),s=document.getElementById("whKpiReceivedOrdersTotalQty"),i=document.getElementById("whKpiReceivedOrdersTotalAmount"),l=document.getElementById("whReceivedOrdersCountText"),d=0,c=0;if(n.forEach(u=>{d+=Number(u.total_qty)||0,c+=Number(u.total_amount)||0}),r&&(r.textContent=String(n.length)),s&&(s.textContent=L(d,1)),i&&(i.textContent=Math.round(c).toLocaleString("vi-VN")+" \u20AB"),l&&(l.textContent=String(n.length)),!n.length){t&&(t.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}t&&(t.innerHTML=n.map((u,h)=>{let y=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',p=z(u.receipt_date),b=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="w-10 text-center text-gray-400 num font-mono text-xs">${h+1}</td>
          <td class="col-code font-bold">
            <span class="code font-bold text-brand-600 dark:text-brand-400">${m(u.po_number||"\u2014")}</span>
            <div class="mt-0.5">${y}</div>
          </td>
          <td class="col-code">
            <span class="code text-gray-800 dark:text-gray-200">${m(u.receipt_code||"\u2014")}</span>
          </td>
          <td class="text-center font-semibold text-xs text-gray-700 dark:text-gray-300">
            <span class="badge badge-neutral">${m(u.site_code||"K001")}</span>
          </td>
          <td class="col-date num whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">${p}</td>
          <td>
            <div class="font-medium text-xs text-gray-900 dark:text-white">${m(u.supplier||"N/A")}</div>
            ${u.notes?`<div class="text-xs text-gray-400 truncate max-w-[200px]" title="${m(u.notes)}">${m(u.notes)}</div>`:""}
          </td>
          <td class="col-num text-center num text-xs font-semibold">${u.item_count||1} m\xF3n</td>
          <td class="col-num text-right font-bold text-gray-900 dark:text-white num text-xs">${b}</td>
          <td class="text-xs text-gray-500 dark:text-gray-400">${m(u.created_by||"Th\u1EE7 kho")}</td>
          <td class="col-badge text-center">
            <span class="badge badge-brand text-xs whitespace-nowrap">\u0110\xE3 nh\u1EADp kho</span>
          </td>
          <td class="col-actions text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-center">
              <button onclick="openWhReceivedOrderDetail('${u.id||""}', '${m(u.po_number||"")}')" class="btn btn-secondary btn-sm" title="Xem chi ti\u1EBFt d\xF2ng h\xE0ng">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
              </button>
              <button onclick="confirmCancelReceivedOrder('${u.id||""}', '${m(u.po_number||"")}', '${m(u.receipt_code||"")}', ${Number(u.total_amount)||0})" class="btn btn-danger btn-sm" title="H\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> H\u1EE7y nh\u1EADp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=n.map(u=>{let g=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',y=z(u.receipt_date),p=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${m(u.po_number||u.receipt_code||"")}</span>
              ${g}
            </div>
            <span class="badge badge-brand text-xs">\u0110\xE3 nh\u1EADp kho</span>
          </div>

          <div class="data-card-body space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Phi\u1EBFu nh\u1EADp:</span>
              <span class="code text-gray-700 dark:text-gray-300 font-semibold">${m(u.receipt_code||"\u2014")}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Nh\xE0 cung c\u1EA5p:</span>
              <span class="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">${m(u.supplier||"N/A")}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">\u0110i\u1EC3m nh\u1EADn / Ng\xE0y:</span>
              <span class="text-gray-600 dark:text-gray-300 font-medium">${m(u.site_code||"")} \u2022 <span class="num">${y}</span></span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-gray-400 block">S\u1ED1 m\u1EB7t h\xE0ng</span>
                <span class="num font-bold text-gray-900 dark:text-white">${u.item_count||1} m\xF3n (${L(u.total_qty||0,1)})</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 block">T\u1ED5ng ti\u1EC1n nh\u1EADp</span>
                <span class="num font-bold text-brand-600 dark:text-brand-400 text-sm">${p}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openWhReceivedOrderDetail('${u.id||""}', '${m(u.po_number||"")}')" class="btn btn-secondary btn-sm w-full">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Xem chi ti\u1EBFt
            </button>
            <button onclick="confirmCancelReceivedOrder('${u.id||""}', '${m(u.po_number||"")}', '${m(u.receipt_code||"")}', ${Number(u.total_amount)||0})" class="btn btn-danger btn-sm w-full">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> H\u1EE7y nh\u1EADp kho
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function ba(){ce()}async function ue(){dn();let t=document.getElementById("whReceivedOrdersSiteFilter"),o=localStorage.getItem("orbit_user_site"),a=document.getElementById("globalBranchSelect")?.value,e=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,n=o||a||e||(t?t.value:null)||"K001";(n==="ALL"||n==="all")&&(n="K001"),n=n.toUpperCase(),t&&(t.value=n);let r=n,s=document.getElementById("whReceivedOrdersTableBody"),i=document.getElementById("whReceivedOrdersMobileCards");s&&(s.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</td></tr>'),i&&(i.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</div>');try{let d=await(await fetch(`/api/wh/received-orders?site=${encodeURIComponent(r)}&no-cache=1`)).json();d.success&&d.data?at=d.data.orders||[]:at=[],typeof window<"u"&&(window.gWhReceivedOrders=at);let c=document.getElementById("whInvBadgeReceiptsCount");c&&(c.textContent=String(at.length)),ce()}catch(l){console.error("loadWhReceivedOrders error:",l),s&&(s.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</td></tr>`),i&&(i.innerHTML=`<div class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</div>`)}}async function xa(t,o){let a=document.getElementById("whReceivedOrderDetailModal");if(!a)return;a.classList.remove("hidden");let e=document.getElementById("whRecModalTitle"),n=document.getElementById("whRecModalPoNumber"),r=document.getElementById("whRecModalReceiptCode"),s=document.getElementById("whRecModalSite"),i=document.getElementById("whRecModalDate"),l=document.getElementById("whRecModalSupplier"),d=document.getElementById("whRecModalCreatedBy"),c=document.getElementById("whRecModalTotalAmount"),u=document.getElementById("whRecModalLinesBody");e&&(e.textContent=`Chi ti\u1EBFt \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho: ${o||t}`),n&&(n.textContent=o||"\u2014"),u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng \u0111\xE3 nh\u1EADp...</td></tr>'),rt={receiptId:t,poNumber:o},typeof window<"u"&&(window.gWhCurrentReceivedDetail=rt);try{let h=(at||[]).find(y=>t&&String(y.id)===String(t)||o&&y.po_number===o);h&&(r&&(r.textContent=h.receipt_code||"\u2014"),s&&(s.textContent=h.site_code||"\u2014"),i&&(i.textContent=z(h.receipt_date)),l&&(l.textContent=h.supplier||"\u2014"),d&&(d.textContent=h.created_by||"Th\u1EE7 kho"),c&&(c.textContent=Math.round(Number(h.total_amount)||0).toLocaleString("vi-VN")+" \u20AB"),rt.receiptCode=h.receipt_code,rt.totalAmount=h.total_amount);let g=[];if(t){let p=await(await fetch(`/api/fnb/receipts?id=${encodeURIComponent(t)}`)).json();p.success&&p.data&&(g=p.data.lines||[])}else if(o){let p=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(o)}`)).json();p.success&&p.data&&(g=(p.data||[]).map(b=>({item_code:b.article,item_name:b.article_desc||b.article,unit:b.order_unit||"Ph\u1EA7n",qty:b.received_qty||b.order_qty,unit_price:b.net_price,amount:(b.received_qty||b.order_qty)*b.net_price,batch_code:b.batch_code||"L\xD4-SAP",exp_date:b.exp_date||null})))}if(!g.length){u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">Kh\xF4ng c\xF3 d\xF2ng h\xE0ng n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho phi\u1EBFu n\xE0y.</td></tr>');return}u&&(u.innerHTML=g.map((y,p)=>{let b=Number(y.qty)||0,f=Number(y.unit_price)||0,x=Number(y.amount)||b*f,w=y.exp_date?z(y.exp_date.slice(0,10)):"\u2014";return`
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
            <td class="text-center num text-xs font-mono text-gray-400">${p+1}</td>
            <td class="col-code font-bold text-xs">${m(y.item_code)}</td>
            <td class="font-medium text-xs text-gray-900 dark:text-white">${m(y.item_name||y.item_code)}</td>
            <td class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300">${m(y.unit||"Ph\u1EA7n")}</td>
            <td class="col-num text-right num font-bold text-emerald-600 dark:text-emerald-400 text-xs">${L(b,1)}</td>
            <td class="col-num text-right num text-xs">${Math.round(f).toLocaleString("vi-VN")} \u20AB</td>
            <td class="col-num text-right num font-semibold text-gray-900 dark:text-white text-xs">${Math.round(x).toLocaleString("vi-VN")} \u20AB</td>
            <td class="text-center font-mono text-xs text-gray-700 dark:text-gray-300">${m(y.batch_code||"\u2014")}</td>
            <td class="col-date text-center num text-xs text-gray-600 dark:text-gray-400">${w}</td>
          </tr>
        `}).join(""))}catch(h){console.error("Error openWhReceivedOrderDetail:",h),u&&(u.innerHTML=`<tr><td colspan="9" class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i chi ti\u1EBFt: ${h.message}</td></tr>`)}typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function ln(){let t=document.getElementById("whReceivedOrderDetailModal");t&&t.classList.add("hidden"),rt=null,typeof window<"u"&&(window.gWhCurrentReceivedDetail=null)}function wa(){if(!rt)return;let{receiptId:t,poNumber:o,receiptCode:a,totalAmount:e}=rt;cn(t,o,a,e)}async function cn(t,o,a,e){let n=a||o||"\u0111\u01A1n h\xE0ng n\xE0y",r=e?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"",s=`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n H\u1EE6Y NH\u1EACP KHO cho \u0111\u01A1n h\xE0ng [${n}]`+(r?` v\u1EDBi gi\xE1 tr\u1ECB ${r}`:"")+`?

\u2022 To\xE0n b\u1ED9 s\u1ED1 l\u01B0\u1EE3ng nh\u1EADp kho s\u1EBD \u0111\u01B0\u1EE3c HO\xC0N T\xC1C TR\u1EEA KH\u1ECEI T\u1ED2N KHO th\u1EF1c t\u1EBF.
\u2022 \u0110\u01A1n h\xE0ng PO/PR s\u1EBD \u0111\u01B0\u1EE3c m\u1EDF l\u1EA1i (tr\u1EA1ng th\xE1i Ch\u1EDD nh\u1EADp) \u0111\u1EC3 c\xF3 th\u1EC3 nh\u1EADp l\u1EA1i khi c\u1EA7n.`;if(confirm(s))try{typeof showLoading=="function"&&showLoading("\u0110ang h\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho...");let l=await(await fetch("/api/fnb/receipts/cancel",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t||void 0,po_number:o||void 0})})).json();l.success?(typeof showToast=="function"&&showToast(l.message||"H\u1EE7y nh\u1EADp kho th\xE0nh c\xF4ng!","success"),ln(),ue()):typeof showToast=="function"&&showToast(`L\u1ED7i h\u1EE7y nh\u1EADp kho: ${l.error}`,"error")}catch(i){console.error("confirmCancelReceivedOrder error:",i),typeof showToast=="function"&&showToast(`L\u1ED7i k\u1EBFt n\u1ED1i: ${i.message}`,"error")}finally{typeof hideLoading=="function"&&hideLoading()}}function va(){let t=ct&&ct.length?ct:j;if(!t||!t.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let o=document.getElementById("whInvSiteSelect")?.value||"ALL",e=[["STT","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","Nh\xF3m Ng\xE0nh H\xE0ng","\u0110\u01A1n V\u1ECB T\xEDnh","S\u1ED1 L\u01B0\u1EE3ng \u0110\xE3 Nh\u1EADp","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n S\u1ED5 S\xE1ch","\u0110\u01A1n Gi\xE1 Chu\u1EA9n (VN\u0110)","T\u1ED5ng Gi\xE1 Tr\u1ECB T\u1ED3n (VN\u0110)","S\u1ED1 L\xF4 Qu\u1EA3n L\xFD","Ng\xE0y Nh\u1EADp G\u1EA7n Nh\u1EA5t","Ng\xE0y Ki\u1EC3m K\xEA G\u1EA7n Nh\u1EA5t"]];t.forEach((d,c)=>{e.push([c+1,d.sku||"",d.name||"",d.category||"",d.unit||"",parseFloat(String(d.receipt_qty||0)),parseFloat(String(d.book_qty||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.total_value||0)),parseInt(String(d.batch_count||0),10),d.last_receipt_date?String(d.last_receipt_date).split("T")[0]:"",d.last_count_date?String(d.last_count_date).split("T")[0]:""])});let n=XLSX.utils.book_new(),r=XLSX.utils.aoa_to_sheet(e),s=XLSX.utils.decode_range(r["!ref"]);r["!cols"]=[{wch:6},{wch:14},{wch:34},{wch:18},{wch:10},{wch:16},{wch:18},{wch:18},{wch:20},{wch:14},{wch:16},{wch:18}];for(let d=s.s.r;d<=s.e.r;++d)for(let c=s.s.c;c<=s.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(r[u])if(d===0)r[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let h="left",g;c===0||c===1||c===4||c===9||c===10||c===11?h="center":c===5||c===6?(h="right",g="#,##0.0"):(c===7||c===8)&&(h="right",g="#,##0");let y=c===6&&typeof r[u].v=="number"&&r[u].v<0;r[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===8,color:{rgb:y?"C00000":"000000"}},alignment:{horizontal:h,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},g&&(r[u].z=g)}}r["!freeze"]={xSplit:0,ySplit:1},r["!autofilter"]={ref:r["!ref"]};let i=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`Ton_Kho_WMS_${o}_${i}.xlsx`;XLSX.utils.book_append_sheet(n,r,"TonKhoWMS"),XLSX.writeFile(n,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho ${o} th\xE0nh c\xF4ng!`,"success")}function ka(){if(!ot||!ot.history){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u th\u1EBB kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let t=ot,o=t.history||[];if(!o.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 ph\xE1t sinh giao d\u1ECBch n\xE0o \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let e=[["STT","Ng\xE0y Ch\u1EE9ng T\u1EEB","S\u1ED1 Ch\u1EE9ng T\u1EEB","Lo\u1EA1i Nghi\u1EC7p V\u1EE5","M\xE3 L\xF4","H\u1EA1n D\xF9ng (HSD)","S\u1ED1 L\u01B0\u1EE3ng Nh\u1EADp (+)","S\u1ED1 L\u01B0\u1EE3ng Xu\u1EA5t (-)","\u0110\u01A1n Gi\xE1 (VN\u0110)","Th\xE0nh Ti\u1EC1n (VN\u0110)","\u0110\u1ED1i T\xE1c / Nh\xE0 Cung C\u1EA5p","Ghi Ch\xFA / Di\u1EC5n Gi\u1EA3i"]];o.forEach((d,c)=>{e.push([c+1,d.doc_date?String(d.doc_date).split("T")[0]:"",d.doc_no||"",d.trans_name||d.trans_type||"",d.batch_code||"",d.exp_date?String(d.exp_date).split("T")[0]:"",parseFloat(String(d.qty_in||0)),parseFloat(String(d.qty_out||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.amount||0)),d.partner_name||"",d.notes||""])});let n=XLSX.utils.book_new(),r=XLSX.utils.aoa_to_sheet(e),s=XLSX.utils.decode_range(r["!ref"]);r["!cols"]=[{wch:6},{wch:14},{wch:16},{wch:16},{wch:14},{wch:14},{wch:16},{wch:16},{wch:16},{wch:18},{wch:28},{wch:30}];for(let d=s.s.r;d<=s.e.r;++d)for(let c=s.s.c;c<=s.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(r[u])if(d===0)r[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let h="left",g;c===0||c===1||c===2||c===3||c===4||c===5?h="center":c===6||c===7?(h="right",g="#,##0.0"):(c===8||c===9)&&(h="right",g="#,##0"),r[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===7,color:{rgb:"000000"}},alignment:{horizontal:h,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},g&&(r[u].z=g)}}r["!freeze"]={xSplit:0,ySplit:1},r["!autofilter"]={ref:r["!ref"]};let i=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`The_Kho_${t.sku}_${t.site}_${i}.xlsx`;XLSX.utils.book_append_sheet(n,r,"TheKho"),XLSX.writeFile(n,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t th\u1EBB kho m\xE3 ${t.sku} th\xE0nh c\xF4ng!`,"success")}if(typeof window<"u"){let t=window;t.gWhInventoryData=j,t.gWhFilteredInventory=ct,t.gWhActiveHistory=ot,t.gWhActiveBatches=Ht,t.gWhReceivedOrders=at,t.gWhCurrentReceivedDetail=rt,t.loadWhInventory=sn,t.loadPoSap=sn,t.filterWhInventoryTable=rn,t.openWhItemHistoryModal=fa,t.openWhItemBatchesModal=ha,t.switchWhInvSubView=ya,t.populateWhReceivedOrdersSiteFilter=dn,t.loadWhReceivedOrders=ue,t.filterWhReceivedOrdersTable=ba,t.renderWhReceivedOrdersTable=ce,t.openWhReceivedOrderDetail=xa,t.closeWhReceivedOrderDetailModal=ln,t.onWhRecModalCancelClick=wa,t.confirmCancelReceivedOrder=cn,t.exportWhInventoryToExcel=va,t.exportWhItemHistoryToExcel=ka}var W=[],Nt="ALL";async function La(){let t=document.getElementById("btnSyncFnbMonthly"),o=document.getElementById("iconSyncFnbMonthly"),a=document.getElementById("labelSyncFnbMonthly");try{t&&(t.disabled=!0),o&&o.classList.add("animate-spin"),a&&(a.textContent="\u0110ang \u0111\u1ED3ng b\u1ED9...");let n=document.getElementById("globalMonthPicker")?.value||new Date().toISOString().slice(0,7),s=await(await fetch("/api/fnb/chain/sync-monthly",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({month:n})})).json();s.success?(typeof showToast=="function"&&showToast(`\u0110\xE3 \u0111\u1ED3ng b\u1ED9 s\u1ED1 li\u1EC7u th\xE1ng ${n} th\xE0nh c\xF4ng (${s.count||14} \u0111i\u1EC3m b\xE1n)!`,"success"),await un()):typeof showToast=="function"&&showToast("L\u1ED7i \u0111\u1ED3ng b\u1ED9: "+(s.error||"Kh\xF4ng th\xE0nh c\xF4ng"),"error")}catch(e){console.error("triggerSyncFnbMonthlySummary error:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi \u0111\u1ED3ng b\u1ED9: "+e.message,"error")}finally{t&&(t.disabled=!1),o&&o.classList.remove("animate-spin"),a&&(a.textContent="\u0110\u1ED3ng b\u1ED9 s\u1ED1 li\u1EC7u"),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}async function un(){try{typeof showLoading=="function"&&showLoading();let o=document.getElementById("globalMonthPicker")?.value||"2026-11",e=await(await fetch(`/api/fnb/chain?month=${encodeURIComponent(o)}`)).json();if(e.success&&e.data){let n=e.data;W=n.rankings||[],typeof renderKpi=="function"&&(renderKpi("chainTotalRevenue",{value:n.totalChainRevenue,sub:"14 \u0110i\u1EC3m b\xE1n to\xE0n h\u1EC7 th\u1ED1ng A.Kitchen"}),renderKpi("chainTotalProfit",{value:n.totalChainProfit,sub:"L\u1EE3i nhu\u1EADn g\u1ED9p to\xE0n chu\u1ED7i"}),renderKpi("chainAvgFoodCost",{text:`${n.avgFoodCostPct}%`,sub:"d\u01B0\u1EDBi ng\u01B0\u1EE1ng 43%",deltaGood:n.avgFoodCostPct<=43}),renderKpi("chainAvgLaborCost",{text:`${n.avgLaborCostPct}%`,sub:"d\u01B0\u1EDBi ng\u01B0\u1EE1ng 19%",deltaGood:n.avgLaborCostPct<=19}));let r=document.getElementById("chainAvgMargin");r&&(r.textContent=`${n.avgChainMargin}%`),Ft(W)}}catch(t){console.error("Error loadFnbChain:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u to\xE0n chu\u1ED7i: "+t.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Ft(t){let o=document.getElementById("fnbChainTableBody"),a=document.getElementById("fnbChainMobileCards"),e=t||W;if(!e||e.length===0){o&&(o.innerHTML='<tr><td colspan="11" class="text-center py-8 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111i\u1EC3m b\xE1n n\xE0o ph\xF9 h\u1EE3p.</td></tr>'),a&&(a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111i\u1EC3m b\xE1n n\xE0o ph\xF9 h\u1EE3p.</div>');return}o&&(o.innerHTML=e.map(n=>{let r="";n.status==="V\u01AF\u1EE2T CH\u1EC8 TI\xCAU"?r='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">V\u01AF\u1EE2T CH\u1EC8 TI\xCAU</span>':n.status==="TRONG M\u1EE8C"?r='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">TRONG M\u1EE8C</span>':n.status==="CH\u01AFA PH\xC1T SINH"?r='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">CH\u01AFA PH\xC1T SINH</span>':r='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">C\u1EA6N XEM X\xC9T</span>';let s="";n.rank===1?s='<span class="w-6 h-6 rounded-full bg-amber-400 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F947}1</span>':n.rank===2?s='<span class="w-6 h-6 rounded-full bg-gray-300 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F948}2</span>':n.rank===3?s='<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F949}3</span>':s=`<span class="tabular-nums font-mono text-gray-500 font-bold">${n.rank}</span>`;let i=parseFloat(String(n.achievementPct))||0,l=parseFloat(String(n.foodCostPct))||0;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center">${s}</td>
          <td class="py-3 px-4">
            <div class="font-bold text-gray-900 dark:text-white">${n.name}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">SAP: ${n.code}</div>
          </td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold ${n.region==="Mi\u1EC1n Nam"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300":"bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"}">${n.region}</span>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${S(n.netRevenue)}</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-gray-500">${S(n.targetRevenue)}</td>
          <td class="py-3 px-3 text-center">
            <div class="font-mono tabular-nums font-bold text-gray-900 dark:text-white">${n.achievementPct}%</div>
            <div class="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
              <div class="${i>=100?"bg-emerald-500":"bg-blue-500"} h-1.5 rounded-full" style="width: ${Math.min(100,i)}%"></div>
            </div>
          </td>
          <td class="py-3 px-3 text-center font-mono tabular-nums ${l<=43?"text-emerald-600 font-bold":"text-rose-600 font-bold"}">${n.foodCostPct}%</td>
          <td class="py-3 px-3 text-center font-mono tabular-nums text-purple-600 font-bold">${n.laborCostPct}%</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-600">${S(n.operatingProfit)}</td>
          <td class="py-3 px-3 text-center">${r}</td>
          <td class="py-3 px-3 text-center">
            <button onclick="viewSitePL('${n.code}')" class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1 mx-auto">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
              <span>P&amp;L</span>
            </button>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(n=>{let r="";return n.status==="V\u01AF\u1EE2T CH\u1EC8 TI\xCAU"?r='<span class="badge badge-success text-xs">V\u01B0\u1EE3t ch\u1EC9 ti\xEAu</span>':n.status==="TRONG M\u1EE8C"?r='<span class="badge badge-brand text-xs">Trong m\u1EE9c</span>':n.status==="CH\u01AFA PH\xC1T SINH"?r='<span class="badge badge-neutral text-xs">Ch\u01B0a ph\xE1t sinh</span>':r='<span class="badge badge-danger text-xs">C\u1EA7n xem x\xE9t</span>',`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="font-bold text-brand-600 dark:text-brand-400 font-mono text-xs">#${n.rank} ${n.code}</span>
              ${r}
            </div>
            <span class="text-xs text-gray-400">${n.region}</span>
          </div>
          <div class="data-card-body space-y-2">
            <div class="font-bold text-sm text-gray-900 dark:text-white">${n.name}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">Doanh thu:</span>
                <span class="font-mono font-bold text-gray-900 dark:text-white ml-1">${S(n.netRevenue)}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">\u0110\u1EA1t ch\u1EC9 ti\xEAu:</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 ml-1">${n.achievementPct}%</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs text-center pt-1 border-t border-gray-100 dark:border-gray-800">
              <div>
                <div class="text-gray-400 text-[10px]">Food Cost</div>
                <div class="font-mono font-bold ${parseFloat(String(n.foodCostPct))<=43?"text-emerald-600":"text-rose-600"}">${n.foodCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">Labor Cost</div>
                <div class="font-mono font-bold text-purple-600">${n.laborCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">EBITDA</div>
                <div class="font-mono font-bold text-emerald-600">${S(n.operatingProfit)}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewSitePL('${n.code}')" class="btn btn-secondary btn-sm">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Xem P&L
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function Sa(t){Nt=t,["filterRegALL","filterRegMN","filterRegMB"].forEach(n=>{let r=document.getElementById(n);r&&(r.classList.remove("bg-brand-500","text-white","shadow-xs","font-bold"),r.classList.add("font-medium","text-gray-600","dark:text-gray-300"))});let o=t==="ALL"?"filterRegALL":t==="Mi\u1EC1n Nam"?"filterRegMN":"filterRegMB",a=document.getElementById(o);a&&(a.classList.remove("font-medium","text-gray-600","dark:text-gray-300"),a.classList.add("bg-brand-500","text-white","shadow-xs","font-bold"));let e=W;t!=="ALL"&&(e=W.filter(n=>n.region===t)),Ft(e)}function Ta(t){let o=String(t||"").toLowerCase().trim(),a=W;Nt!=="ALL"&&(a=a.filter(e=>e.region===Nt)),o&&(a=a.filter(e=>e.code.toLowerCase().includes(o)||e.name.toLowerCase().includes(o)||e.region.toLowerCase().includes(o))),Ft(a)}var vt=null;function Ca(t){let o=document.getElementById("plSiteSelector");o&&(o.value=t);let a=document.getElementById("globalBranchSelect");a&&(a.value=t),typeof window.switchTab=="function"&&window.switchTab("fnb-pl"),pe()}async function pe(){try{typeof showLoading=="function"&&showLoading();let o=document.getElementById("globalBranchSelect")?.value||localStorage.getItem("orbit_user_site")||"K001",e=document.getElementById("globalMonthPicker")?.value||"2026-11",r=await(await fetch(`/api/fnb/pl?site=${encodeURIComponent(o)}&thang=${encodeURIComponent(e)}`)).json();if(r.success&&r.data){vt=r.data,typeof window<"u"&&(window.currentPLData=vt);let s=document.getElementById("plSiteSelector");s&&r.data.siteCode&&(s.value=r.data.siteCode),gn(r.data);let i=document.getElementById("plFocusFilter")?.value||"ALL";pn(i)}}catch(t){console.error("Error loadFnbPL:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i P&L: "+t.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function pn(t){let o=document.querySelector("#fnb-pl table tbody");if(!o)return;o.querySelectorAll("tr").forEach(e=>{let n=(e.textContent||"").toLowerCase();!t||t==="ALL"?e.style.display="":t==="COGS"?n.includes("gi\xE1 v\u1ED1n")||n.includes("food cost")||n.includes("nguy\xEAn v\u1EADt li\u1EC7u")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none":t==="LABOR"?n.includes("nh\xE2n s\u1EF1")||n.includes("labor")||n.includes("qu\u1EF9 l\u01B0\u01A1ng")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none":t==="OPEX"?n.includes("v\u1EADn h\xE0nh")||n.includes("thu\xEA")||n.includes("\u0111i\u1EC7n")||n.includes("c\u1ED1 \u0111\u1ECBnh")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none":t==="EBITDA"&&(n.includes("ebitda")||n.includes("l\u1EE3i nhu\u1EADn")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none")})}function gn(t){if(!t)return;let o=document.getElementById("plSiteTitle");o&&(o.textContent=`B\xE1o C\xE1o P&L: ${t.site}`);let a=t.targetRevenue>0?t.netRevenue/t.targetRevenue*100:0;typeof renderKpi=="function"&&renderKpi("plNetRev",{value:t.netRevenue,sub:"Doanh thu sau chi\u1EBFt kh\u1EA5u"});let e=document.getElementById("plAchievement");if(e){let f=a>0?`${a.toFixed(1)}%`:"0,0%",x=a>=100;e.className=x?"kpi-delta-good":"kpi-delta-bad",e.innerHTML=`<svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${x?"M12 19V5m0 0l-6 6m6-6l6 6":"M12 5v14m0 0l-6-6m6 6l6-6"}"/></svg><span class="font-mono tabular-nums">${f}</span><span class="sr-only">${x?"\u0111\u1EA1t":"ch\u01B0a \u0111\u1EA1t"}</span>`}let n=t.netRevenue>0?t.foodCost/t.netRevenue*100:0,r=t.netRevenue>0?t.laborCost/t.netRevenue*100:0,s=t.netRevenue>0?t.primeCost/t.netRevenue*100:0;typeof renderKpi=="function"&&renderKpi("plPrimeCostPct",{text:`${s.toFixed(1)}%`,sub:"M\u1EE5c ti\xEAu \u2264 62,0%",progress:Math.min(100,s/62*100)});let i=document.getElementById("plPrimeCostBar");i&&(i.style.width=`${Math.min(100,s/62*100)}%`,i.className=s>62?"kpi-progress-bar-error":"kpi-progress-bar");let l=document.getElementById("plFoodCostPct");l&&(l.textContent=`${n.toFixed(1)}%`);let d=document.getElementById("plFoodCostVal");d&&(d.textContent=S(t.foodCost));let c=document.getElementById("plLaborCostPct");c&&(c.textContent=`${r.toFixed(1)}%`);let u=document.getElementById("plLaborCostVal");u&&(u.textContent=S(t.laborCost)),typeof renderKpi=="function"&&(renderKpi("plProfitVal",{value:t.operatingProfit,sub:"L\u1EE3i nhu\u1EADn ho\u1EA1t \u0111\u1ED9ng"}),renderKpi("plBreakEven",{value:t.breakEvenRevenue,sub:"C\u1ED1 \u0111\u1ECBnh th\xE1ng"}));let h=document.getElementById("plProfitMargin");if(h){let f=t.profitMargin>=20;h.className=f?"kpi-delta-good":t.profitMargin>=0?"kpi-delta-neutral":"kpi-delta-bad",h.innerHTML=`<span class="font-mono tabular-nums">${t.profitMargin}%</span>`}let g=(f,x)=>{let w=document.getElementById(f);w&&(w.textContent=x)};g("plRowGross",S(t.grossRevenue)),g("plRowDiscount","-"+S(t.discount)),g("plRowNet",S(t.netRevenue)),t.channels&&(g("plRowDineIn",S(t.channels.dineIn)),g("plRowTakeaway",S(t.channels.takeaway)),g("plRowCatering",S(t.channels.catering))),g("plRowFoodCost",S(t.foodCost)),g("plRowFoodCostPct",t.netRevenue>0?`${(t.foodCost/t.netRevenue*100).toFixed(1)}%`:"0.0%"),g("plRowLaborCost",S(t.laborCost)),g("plRowLaborCostPct",t.netRevenue>0?`${(t.laborCost/t.netRevenue*100).toFixed(1)}%`:"0.0%"),g("plRowPrimeCost",S(t.primeCost)),g("plRowPrimeCostPct",t.netRevenue>0?`${(t.primeCost/t.netRevenue*100).toFixed(1)}%`:"0.0%"),g("plRowRent",S(t.rentCost)),g("plRowUtilities",S(t.utilityCost)),g("plRowSupplies",S(t.supplyCost)),g("plRowWaste",S(t.wasteCost)),g("plRowMarketing",S(t.marketingCost)),g("plRowTotalCost",S(t.totalCost)),g("plRowEBITDA",S(t.operatingProfit)),g("plRowEBITDAPct",`${t.profitMargin}%`);let y=document.getElementById("plWeeklyTrendBody");y&&t.weeklyTrends&&(y.innerHTML=t.weeklyTrends.map(f=>`
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30">
        <td class="py-1 px-2 font-bold font-mono text-xs">${f.week}</td>
        <td class="py-1 px-2 text-right font-mono text-xs">${S(f.netRevenue||f.netRev||0)}</td>
        <td class="py-1 px-2 text-center text-blue-600 font-bold font-mono text-xs">${f.foodCostPct}%</td>
        <td class="py-1 px-2 text-center text-purple-600 font-bold font-mono text-xs">${f.laborCostPct}%</td>
        <td class="py-1 px-2 text-right text-emerald-600 font-bold font-mono text-xs">${f.profitMargin||f.profitPct||0}%</td>
      </tr>
    `).join("")),t.opMetrics&&(g("plOpBillCount",`${t.opMetrics.avgDailyBills||0} bill`),g("plOpAvgBill",S(t.opMetrics.avgSpendPerBill||0)),g("plOpRevSeat",S(t.opMetrics.revenuePerSeatPerDay||0)),g("plOpOccupancy",`${t.opMetrics.peakOccupancyPct||78.5}%`));let p=document.getElementById("plTopDishesList");p&&t.topDishes&&(t.topDishes.length===0?p.innerHTML='<div class="text-xs text-gray-400 py-2 text-center">Ch\u01B0a ph\xE1t sinh m\xF3n trong k\u1EF3</div>':p.innerHTML=t.topDishes.map((f,x)=>`
        <div class="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/40">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-brand-500 font-bold text-xs flex items-center justify-center font-mono">${x+1}</span>
            <span class="font-bold text-gray-800 dark:text-gray-200">${f.name}</span>
          </div>
          <div class="flex items-center gap-3 font-mono tabular-nums text-xs">
            <span class="text-gray-500">${f.qty} su\u1EA5t</span>
            <span class="font-bold text-gray-900 dark:text-white">${S(f.revenue||f.rev||0)}</span>
          </div>
        </div>
      `).join(""));let b=document.getElementById("plActionPlansList");b&&t.actionPlans&&(b.innerHTML=t.actionPlans.map(f=>`
      <div class="flex items-start gap-2 py-0.5">
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
        <span>${typeof f=="object"?f.task||JSON.stringify(f):f}</span>
      </div>
    `).join(""))}function Ea(t){let o=document.getElementById("globalBranchSelect");o&&(o.value=t),pe()}async function Ia(){try{typeof showLoading=="function"&&showLoading();let t=document.getElementById("globalBranchSelect")?.value||"K001",o=document.getElementById("posDatePicker"),a=o?.value||"2026-11-19",n=await(await fetch(`/api/fnb/pos?site=${encodeURIComponent(t)}&date=${encodeURIComponent(a)}`)).json();n.success&&n.data&&(n.data.date&&o&&o.value!==n.data.date&&(o.value=n.data.date),mn(n.data))}catch(t){console.error("Error loadFnbPOS:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i POS: "+t.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function mn(t){if(!t)return;typeof renderKpi=="function"&&(renderKpi("posDailyRevenue",{value:t.dailyRevenue||t.totalSalesToday||0,sub:"so v\u1EDBi TB tu\u1EA7n"}),renderKpi("posDailyBills",{value:t.totalBills||t.billsToday||0,unit:"bill",isCurrency:!1,sub:"S\u1ED1 giao d\u1ECBch thanh to\xE1n"}),renderKpi("posDailyAOV",{value:t.avgSpendPerBill||t.avgBillToday||0,sub:"Su\u1EA5t tr\u01B0a c\xF4ng s\u1EDF"}));let o=document.getElementById("posHourlyList");o&&t.hourlyDistribution&&(o.innerHTML=t.hourlyDistribution.map(a=>`
      <div>
        <div class="flex justify-between font-bold mb-1 font-mono text-xs">
          <span>${a.hour} (${a.bills} bills)</span>
          <span class="tabular-nums">${S(a.revenue||a.sales||0)} (${a.pct}%)</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div class="bg-brand-500 h-2 rounded-full" style="width: ${a.pct}%"></div>
        </div>
      </div>
    `).join(""))}async function Ma(){try{typeof showLoading=="function"&&showLoading();let o=await(await fetch("/api/branches")).json();if(o.success&&Array.isArray(o.data)&&o.data.length>0)Rt(o.data);else{let a=(typeof getAppSitesList=="function"?getAppSitesList():[]).filter(e=>e.code!=="ALL");Rt(a)}}catch(t){console.error("Error loadFnbSites:",t);let o=(typeof getAppSitesList=="function"?getAppSitesList():[]).filter(a=>a.code!=="ALL");Rt(o)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Rt(t){let o=document.getElementById("fnbSitesMasterTableBody"),a=document.getElementById("fnbSitesMobileCards");if(!t)return;let e=document.getElementById("fnbSitesCountBadge");e&&(e.textContent=`${t.length} \u0111i\u1EC3m b\xE1n`),o&&(o.innerHTML=t.map(n=>{let r="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";return n.region==="Mi\u1EC1n B\u1EAFc"?r="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300":n.region==="Mi\u1EC1n Trung"&&(r="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"),`
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-brand-500 dark:text-brand-400 text-xs">${n.code}</td>
          <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">${n.name}</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold border ${r}">${n.region||"Mi\u1EC1n Nam"}</span>
          </td>
          <td class="py-3 px-4 text-gray-500 dark:text-gray-400">${n.address||"H\u1EC7 th\u1ED1ng c\u0103n tin T\xE2n Long Group"}</td>
          <td class="py-3 px-3">
            <div class="font-semibold text-gray-800 dark:text-gray-200">${n.site_type||"Qu\u1EA3n L\xFD C\u01A1 S\u1EDF"}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">${n.phone||"0903.xxx.xxx"}</div>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${Number(n.budget||1e7).toLocaleString("vi-VN")} \u20AB</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HO\u1EA0T \u0110\u1ED8NG</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(n=>{let r="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";return n.region==="Mi\u1EC1n B\u1EAFc"?r="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300":n.region==="Mi\u1EC1n Trung"&&(r="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-brand-500 dark:text-brand-400">${n.code}</span>
              <span class="px-2 py-0.5 rounded text-xs font-bold border ${r}">${n.region||"Mi\u1EC1n Nam"}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HO\u1EA0T \u0110\u1ED8NG</span>
          </div>
          <div class="font-bold text-xs text-gray-900 dark:text-white">${n.name}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"></i>
            <span>${n.address||"H\u1EC7 th\u1ED1ng c\u0103n tin T\xE2n Long Group"}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span class="text-gray-500">H\u1EA1n m\u1EE9c ng\xE2n s\xE1ch:</span>
            <span class="font-bold text-gray-900 dark:text-white font-mono tabular-nums">${Number(n.budget||1e7).toLocaleString("vi-VN")} \u20AB</span>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function $a(){if(!W||W.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u x\u1EBFp h\u1EA1ng \u0111\u1EC3 xu\u1EA5t Excel","warning");return}try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let t=XLSX.utils.book_new(),o=["H\u1EA1ng","M\xE3 SAP","\u0110i\u1EC3m B\xE1n & B\u1EBFp \u0102n","V\xF9ng Mi\u1EC1n","Doanh Thu Thu\u1EA7n (VN\u0110)","M\u1EE5c Ti\xEAu Th\xE1ng (VN\u0110)","% \u0110\u1EA1t Ch\u1EC9 Ti\xEAu","Food Cost %","Labor Cost %","L\u1EE3i Nhu\u1EADn EBITDA (VN\u0110)","Bi\xEAn LN %","Tr\u1EA1ng Th\xE1i"],a=W.map(c=>[c.rank,c.code,c.name,c.region,c.netRevenue,c.targetRevenue,parseFloat(String(c.achievementPct))/100,parseFloat(String(c.foodCostPct))/100,parseFloat(String(c.laborCostPct))/100,c.operatingProfit,parseFloat(String(c.profitMargin))/100,c.status]),e=XLSX.utils.aoa_to_sheet([o,...a]),n={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},r={font:{name:"Aptos",sz:11}},s={font:{name:"Aptos",sz:11},alignment:{horizontal:"center"}},i={font:{name:"Aptos",sz:11},alignment:{horizontal:"right"}},l=XLSX.utils.decode_range(e["!ref"]||"A1");for(let c=l.s.r;c<=l.e.r;++c)for(let u=l.s.c;u<=l.e.c;++u){let h=XLSX.utils.encode_cell({r:c,c:u});e[h]&&(c===0?e[h].s=n:u===0||u===1||u===3||u===11?e[h].s=s:u===2?e[h].s=r:u===6||u===7||u===8||u===10?(e[h].s=i,e[h].z="0.0%"):(e[h].s=i,e[h].z="#,##0"))}e["!freeze"]={xSplit:0,ySplit:1},e["!autofilter"]={ref:e["!ref"]},e["!cols"]=[{wch:8},{wch:10},{wch:38},{wch:14},{wch:22},{wch:20},{wch:14},{wch:14},{wch:14},{wch:22},{wch:12},{wch:16}],XLSX.utils.book_append_sheet(t,e,"XepHangChuoi");let d=new Date().toISOString().slice(0,10);XLSX.writeFile(t,`Orbit_Siba_Food_XepHangChuoi_${d}.xlsx`),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t file Excel x\u1EBFp h\u1EA1ng to\xE0n chu\u1ED7i th\xE0nh c\xF4ng (chu\u1EA9n Aptos).","success")}catch(t){console.error("L\u1ED7i exportFnbChainExcel:",t),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+t.message,"error")}}function _a(){try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let t=vt||(typeof window<"u"?window.currentPLData:null)||{},o=t.netRevenue||47045e4,a=t.grossRevenue||485e6,e=t.discount||1455e4,n=t.channels||{dineIn:Math.round(o*.72),takeaway:Math.round(o*.2),catering:Math.round(o*.08)},r=t.foodCost||Math.round(o*.428),s=t.laborCost||Math.round(o*.185),i=t.primeCost||r+s,l=t.rentCost||28e6,d=t.utilityCost||Math.round(o*.034),c=t.supplyCost||Math.round(o*.03),u=t.wasteCost||Math.round(o*.012),h=t.marketingCost||Math.round(o*.015),g=t.totalCost||r+s+l+d+c+u+h,y=t.operatingProfit||o-g,p=_=>o>0?_/o:0,b=XLSX.utils.book_new(),f=[["KHO\u1EA2N M\u1EE4C B\xC1O C\xC1O P&L","S\u1ED0 TI\u1EC0N (VN\u0110)","% DOANH THU THU\u1EA6N","GHI CH\xDA / \u0110\u1ECANH M\u1EE8C"],["1. Doanh thu g\u1ED9p (Gross Sales)",a,p(a),"Tr\u01B0\u1EDBc khuy\u1EBFn m\xE3i"],["(-) Chi\u1EBFt kh\u1EA5u / Khuy\u1EBFn m\xE3i POS",-e,p(-e),"Trong m\u1EE9c cho ph\xE9p <4%"],["2. DOANH THU THU\u1EA6N (Net Sales)",o,1,"Doanh thu chu\u1EA9n 100%"],["\u2022 \u0102n t\u1EA1i ch\u1ED7 (Dine-in)",n.dineIn,p(n.dineIn),"K\xEAnh ch\u1EE7 l\u1EF1c"],["\u2022 Mang \u0111i (Takeaway)",n.takeaway,p(n.takeaway),"K\xEAnh ph\u1EE5 tr\u1EE3"],["\u2022 Su\u1EA5t \u0103n c\xF4ng nghi\u1EC7p / Hub",n.catering,p(n.catering),"H\u1EE3p \u0111\u1ED3ng ngo\xE0i"],["3. Chi ph\xED Nguy\xEAn V\u1EADt Li\u1EC7u (Food Cost)",r,p(r),`M\u1EE5c ti\xEAu <=43.0% (${t.foodCostPct||(p(r)*100).toFixed(1)}%)`],["4. Chi ph\xED Nh\xE2n c\xF4ng tr\u1EF1c ti\u1EBFp (Labor Cost)",s,p(s),"M\u1EE5c ti\xEAu <=19.0% (18.5%)"],["5. PRIME COST (Food + Labor)",i,p(i),"M\u1EE5c ti\xEAu <=62.0%"],["6. Chi ph\xED M\u1EB7t b\u1EB1ng & Kh\u1EA5u hao",l,p(l),"Chi ph\xED c\u1ED1 \u0111\u1ECBnh"],["7. \u0110i\u1EC7n, N\u01B0\u1EDBc & Gas v\u1EADn h\xE0nh",d,p(d),"\u0110\u1ECBnh m\u1EE9c <=3.5%"],["8. V\u1EADt t\u01B0 ti\xEAu hao & CCDC",c,p(c),"\u0110\u1ECBnh m\u1EE9c tr\u1EA7n theo h\u1EA1n m\u1EE9c"],["9. Hao h\u1EE5t & H\u1ECFng h\u1EE7y",u,p(u),"Ch\u1EC9 ti\xEAu <=1.0%"],["10. Ti\u1EBFp th\u1ECB & POS",h,p(h),"Ch\u1EC9 ti\xEAu <=1.5%"],["T\u1ED4NG CHI PH\xCD HO\u1EA0T \u0110\u1ED8NG",g,p(g),"T\u1ED5ng chi ph\xED v\u1EADn h\xE0nh"],["L\u1EE2I NHU\u1EACN HO\u1EA0T \u0110\u1ED8NG (EBITDA)",y,p(y),`${t.profitMargin||(p(y)*100).toFixed(1)}% Doanh thu`]],x=XLSX.utils.aoa_to_sheet(f),w={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},v={font:{name:"Aptos",sz:11}},T={font:{name:"Aptos",sz:11},alignment:{horizontal:"right"}},E=XLSX.utils.decode_range(x["!ref"]||"A1");for(let _=E.s.r;_<=E.e.r;++_)for(let V=E.s.c;V<=E.e.c;++V){let F=XLSX.utils.encode_cell({r:_,c:V});x[F]&&(_===0?x[F].s=w:V===0?x[F].s=v:V===1?(x[F].s=T,x[F].z="#,##0"):V===2?(x[F].s=T,x[F].z="0.0%"):x[F].s=v)}x["!freeze"]={xSplit:0,ySplit:1},x["!autofilter"]={ref:x["!ref"]},x["!cols"]=[{wch:45},{wch:22},{wch:20},{wch:30}],XLSX.utils.book_append_sheet(b,x,"PL_DiemBan"),XLSX.writeFile(b,`Orbit_Siba_Food_PL_Report_${new Date().toISOString().slice(0,10)}.xlsx`),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t B\xE1o C\xE1o P&L \u0110i\u1EC3m B\xE1n th\xE0nh c\xF4ng (chu\u1EA9n Aptos).","success")}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t P&L Excel: "+t.message,"error")}}if(typeof window<"u"){let t=window;t.gChainRankings=W,t.gCurrentFilterRegion=Nt,t.currentPLData=vt,t.triggerSyncFnbMonthlySummary=La,t.loadFnbChain=un,t.renderFnbChainTable=Ft,t.filterFnbChainByRegion=Sa,t.onSearchChainSite=Ta,t.viewSitePL=Ca,t.loadFnbPL=pe,t.filterPlBreakdown=pn,t.renderFnbPL=gn,t.onSelectPLSite=Ea,t.loadFnbPOS=Ia,t.renderFnbPOS=mn,t.loadFnbSites=Ma,t.renderFnbSites=Rt,t.exportFnbChainExcel=$a,t.exportFnbPLExcel=_a}function fn(t){if(!t||t==="\u2014"||t==="null"||t==="undefined")return"\u2014";let o=String(t).trim();if(!o)return"\u2014";let a=o.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a){let[,n,r,s]=a;return`${s.padStart(2,"0")}/${r.padStart(2,"0")}/${n}`}let e=new Date(o);if(!isNaN(e.getTime())){let n=String(e.getDate()).padStart(2,"0"),r=String(e.getMonth()+1).padStart(2,"0"),s=e.getFullYear();return`${n}/${r}/${s}`}return o}function kt(t){return!t||t==="\u2014"||t==="null"?'<span class="text-gray-400">\u2014</span>':`<span class="code text-brand-600 dark:text-brand-400 font-semibold font-mono text-xs">${m(String(t))}</span>`}function Dt(t){return`<span class="num whitespace-nowrap font-mono text-xs">${fn(t)}</span>`}function ge(t,o){return!o||o==="\u2014"||o==="null"?'<span class="text-gray-400">\u2014</span>':`<span class="badge badge-${t||"neutral"} text-xs">${m(String(o))}</span>`}function me(t){let o=parseInt(t,10)||0;return o?`<span class="file-chip font-mono text-xs" title="${o} t\u1EC7p \u0111\xEDnh k\xE8m"><svg class="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><span>${o}</span></span>`:'<span class="text-gray-400">\u2014</span>'}function fe(t){return!t||t==="unknown"||t==="N/A"||t==="undefined"||t==="null"||String(t).trim()===""?'<span class="text-gray-400">\u2014</span>':`<span class="text-gray-700 dark:text-gray-300 text-xs">${m(String(t))}</span>`}function he(t,o){let a=o||t||"\u2014";return`<span class="text-gray-900 dark:text-white font-medium truncate block max-w-[140px] text-xs" title="${m(a)}">${m(a)}</span>`}var ut=[];function hn(t){let o=Array.from(t.files||[]),a=20*1024*1024;o.forEach(e=>{if(e.size>a){typeof showToast=="function"&&showToast(`File "${e.name}" v\u01B0\u1EE3t qu\xE1 20MB, vui l\xF2ng ch\u1ECDn file nh\u1ECF h\u01A1n.`);return}ut.push({name:e.name,size:e.size,type:e.type||"DOCUMENT"})}),At(),t.value=""}function Ba(t){hn(t)}function At(){let t=document.getElementById("ctFileList");if(!t)return;let o=typeof window<"u"&&window.uploadedFiles?window.uploadedFiles:ut;if(!o.length){t.innerHTML="";return}t.innerHTML=o.map((a,e)=>`
    <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs">
      <div class="flex items-center gap-2 overflow-hidden">
        <i data-lucide="file-text" class="w-4 h-4 text-brand-600 shrink-0"></i>
        <span class="font-bold text-gray-800 dark:text-gray-100 truncate">${m(a.name)}</span>
        <span class="text-gray-400 dark:text-gray-500 font-mono tabular-nums text-xs">(${Math.round(a.size/1024)} KB)</span>
      </div>
      <button type="button" onclick="removeFile(${e})" class="text-rose-600 hover:text-rose-800 font-bold px-2 py-1 text-xs">X\xF3a</button>
    </div>
  `).join(""),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function Ha(t){(typeof window<"u"&&window.uploadedFiles?window.uploadedFiles:ut).splice(t,1),At()}function ye(){let t=document.getElementById("ctNCC");t&&(t.value="");let o=document.getElementById("ctNguoiGiao");o&&(o.value="");let a=document.getElementById("ctNguoiNhan");a&&(a.value="");let e=document.getElementById("ctGhiChu");e&&(e.value="");let n=document.getElementById("ctFile");n&&(n.value=""),ut.length=0,typeof window<"u"&&(window.uploadedFiles=ut),At(),typeof showToast=="function"&&showToast("\u0110\xE3 l\xE0m m\u1EDBi form ch\u1EE9ng t\u1EEB")}function Na(){ye()}async function yn(){let t=document.getElementById("ctSite")?.value||"",o=document.getElementById("ctLoai")?.value||"",a=document.getElementById("ctNgayXuat")?.value||"",e=document.getElementById("ctNgayNhan")?.value||"";if(!t){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Site \xE1p d\u1EE5ng!");return}if(!o){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Lo\u1EA1i h\xF3a \u0111\u01A1n / ch\u1EE9ng t\u1EEB!");return}if(!a||!e){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp Ng\xE0y xu\u1EA5t v\xE0 Ng\xE0y nh\u1EADn!");return}typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u ch\u1EE9ng t\u1EEB & t\u1EC7p \u0111\xEDnh k\xE8m...");let n=document.getElementById("btnLuuCT");n&&(n.disabled=!0);try{let r=typeof App<"u"&&App.user?App.user.email:"Th\u1EE7 kho Site",s={site:t,loaiHoaDon:o,ngayXuat:a,ngayNhan:e,nhaCungCap:document.getElementById("ctNCC")?.value.trim()||"",nguoiGiao:document.getElementById("ctNguoiGiao")?.value.trim()||"",nguoiNhan:document.getElementById("ctNguoiNhan")?.value.trim()||"",ghiChu:document.getElementById("ctGhiChu")?.value.trim()||"",nguoiNhap:r,files:ut.map(d=>({name:d.name,url:"https://drive.google.com/sample",type:d.type}))},l=await(await fetch("/api/voucher",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(l.success){let d=l.data?l.data.maCT:"CT-SUCCESS";typeof openGeneralModal=="function"&&openGeneralModal("L\u01B0u Ch\u1EE9ng T\u1EEB Th\xE0nh C\xF4ng",`
          <div class="text-center py-4 space-y-3">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-title-sm font-bold">\u2713</div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-100">Ch\u1EE9ng t\u1EEB \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u v\xE0o h\u1EC7 th\u1ED1ng!</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-mono tabular-nums">M\xE3 ch\u1EE9ng t\u1EEB: <b class="text-brand-600 text-sm">${m(d)}</b></div>
            <div class="text-xs text-gray-600 dark:text-gray-300">\u0110\xE3 c\u1EADp nh\u1EADt c\u01A1 s\u1EDF d\u1EEF li\u1EC7u Cloudflare D1. B\u1EA1n c\xF3 th\u1EC3 tra c\u1EE9u t\u1EA1i tab "Tra C\u1EE9u Ch\u1EE9ng T\u1EEB".</div>
            <button onclick="closeGeneralModal(); switchTab('portal-search');" class="mt-2 px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
              \u0110\u1EBFn Trang Tra C\u1EE9u
            </button>
          </div>
        `),ye()}else typeof showToast=="function"&&showToast("L\u1ED7i: "+(l.error||"Kh\xF4ng th\u1EC3 l\u01B0u ch\u1EE9ng t\u1EEB"))}catch(r){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+r.message)}finally{typeof hideLoading=="function"&&hideLoading(),n&&(n.disabled=!1)}}function Fa(){return yn()}function Ra(){let t=["M\xE3 Site","T\xEAn Site","Lo\u1EA1i h\xF3a \u0111\u01A1n","Ng\xE0y xu\u1EA5t h\xF3a \u0111\u01A1n (yyyy-mm-dd)","Ng\xE0y nh\u1EADn h\xE0ng (yyyy-mm-dd)","Nh\xE0 cung c\u1EA5p","Ng\u01B0\u1EDDi giao","Ng\u01B0\u1EDDi nh\u1EADn","Ghi ch\xFA","Link \u1EA3nh (Drive)"],o=[["K001","K001 - MN B\u1EBFp \u0102n \u0110\u1EA1i H\u1ECDc H\xF9ng V\u01B0\u01A1ng","H\xF3a \u0111\u01A1n GTGT","2026-11-15","2026-11-15","C\xF4ng ty TNHH Th\u1EF1c Ph\u1EA9m S\u1EA1ch","Nguy\u1EC5n V\u0103n Giao","Tr\u1EA7n Th\u1ECB Nh\u1EADn","H\xE0ng giao \u0111\u1EE7 s\u1ED1 l\u01B0\u1EE3ng, bao b\xEC nguy\xEAn v\u1EB9n","https://drive.google.com/file/d/1sample1/view"]];typeof exportStyledExcel=="function"&&(exportStyledExcel("Template_Import_Chung_Tu.xlsx","ImportChungTu",t,o,[],[0,3,4]),typeof showToast=="function"&&showToast("\u0110\xE3 t\u1EA3i template Excel import ch\u1EE9ng t\u1EEB v\u1EC1 m\xE1y!"))}function Da(t){let o=t.files&&t.files[0];if(!o)return;let a=document.getElementById("importInfo"),e=document.getElementById("importResult");a&&(a.textContent=`\u0110ang \u0111\u1ECDc file: ${o.name}...`);let n=new FileReader;n.onload=async function(r){try{let s=new Uint8Array(r.target?.result),i=XLSX.read(s,{type:"array"}),l=i.Sheets[i.SheetNames[0]],d=XLSX.utils.sheet_to_json(l,{defval:""});if(!d.length){typeof showToast=="function"&&showToast("File Excel kh\xF4ng c\xF3 d\xF2ng d\u1EEF li\u1EC7u n\xE0o!"),a&&(a.textContent=""),t.value="";return}let c=typeof App<"u"&&App.user?App.user.email:"Import Excel",u=d.map(y=>{let p=y["T\xEAn Site"]||y.Site||y["M\xE3 Site"]||"",b=y["Lo\u1EA1i h\xF3a \u0111\u01A1n"]||y["Lo\u1EA1i ch\u1EE9ng t\u1EEB"]||"H\xF3a \u0111\u01A1n GTGT",f=y["Ng\xE0y xu\u1EA5t h\xF3a \u0111\u01A1n (yyyy-mm-dd)"]||y["Ng\xE0y xu\u1EA5t"]||"",x=y["Ng\xE0y nh\u1EADn h\xE0ng (yyyy-mm-dd)"]||y["Ng\xE0y nh\u1EADn"]||"",w=y["Nh\xE0 cung c\u1EA5p"]||"",v=y["Ng\u01B0\u1EDDi giao"]||"",T=y["Ng\u01B0\u1EDDi nh\u1EADn"]||"",E=y["Ghi ch\xFA"]||"",_=y["Link \u1EA3nh (Drive)"]||y["Link \u1EA3nh"]||"";return{site:p,loaiHoaDon:b,ngayXuat:f,ngayNhan:x,nhaCungCap:w,nguoiGiao:v,nguoiNhan:T,ghiChu:E,linkAnh:_,nguoiNhap:c}}).filter(y=>y.site&&y.loaiHoaDon);if(!u.length){typeof showToast=="function"&&showToast("Kh\xF4ng t\xECm th\u1EA5y d\xF2ng n\xE0o h\u1EE3p l\u1EC7 (c\u1EA7n c\xF3 Site v\xE0 Lo\u1EA1i h\xF3a \u0111\u01A1n)!"),a&&(a.textContent=""),t.value="";return}typeof showLoading=="function"&&showLoading(`\u0110ang import ${u.length} ch\u1EE9ng t\u1EEB v\xE0o D1...`);let g=await(await fetch("/api/vouchers/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:u})})).json();g.success?(a&&(a.textContent=""),e&&(e.innerHTML=`
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <span>\u2713 <b>Th\xE0nh c\xF4ng:</b> \u0110\xE3 import ${g.count} ch\u1EE9ng t\u1EEB v\xE0o h\u1EC7 th\u1ED1ng Cloudflare D1.</span>
              <button onclick="switchTab('portal-search')" class="underline font-bold">Xem danh s\xE1ch</button>
            </div>
          `),typeof showToast=="function"&&showToast(`\u0110\xE3 import th\xE0nh c\xF4ng ${g.count} ch\u1EE9ng t\u1EEB!`)):typeof showToast=="function"&&showToast("L\u1ED7i: "+(g.error||"Kh\xF4ng th\u1EC3 import ch\u1EE9ng t\u1EEB"))}catch(s){typeof showToast=="function"&&showToast("L\u1ED7i \u0111\u1ECDc file Excel: "+s.message)}finally{typeof hideLoading=="function"&&hideLoading(),t.value=""}},n.readAsArrayBuffer(o)}async function Aa(){let t=document.getElementById("scSite"),o=document.getElementById("scLoai"),a=t?t.value:"",e=o?o.value:"",n=`/api/vouchers?site=${encodeURIComponent(a)}&loaiHoaDon=${encodeURIComponent(e)}`;try{let s=await(await fetch(n)).json(),i=document.getElementById("scBody");s.success&&s.data&&s.data.length?i&&(i.innerHTML=s.data.map(l=>`
          <tr>
            <td class="col-code">${kt(l.maCT)}</td>
            <td>${he(l.site)}</td>
            <td class="col-badge">${ge("neutral",l.loaiHoaDon)}</td>
            <td class="col-date">${Dt(l.ngayXuat)}</td>
            <td class="col-date">${Dt(l.ngayNhan)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white text-xs">${m(l.nhaCungCap||"\u2014")}</span></td>
            <td>${fe(l.nguoiNhap)}</td>
            <td class="col-badge text-center">${me(l.soFile)}</td>
            <td class="col-actions text-right">
              <button onclick="viewVoucherDetail('${m(l.maCT)}')" class="btn btn-sm btn-ghost" title="Xem chi ti\u1EBFt">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Xem</span>
              </button>
            </td>
          </tr>
        `).join("")):i&&(i.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">Kh\xF4ng c\xF3 ch\u1EE9ng t\u1EEB n\xE0o.</td></tr>')}catch(r){console.error("searchVouchers error:",r)}}async function Pa(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt ch\u1EE9ng t\u1EEB...");try{let a=await(await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(t)}`)).json();if(a.success){let e=a.data,n=`
        <div class="space-y-4 text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800 text-sm">
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">M\xE3 ch\u1EE9ng t\u1EEB:</span> <span class="code font-semibold text-brand-600 dark:text-brand-400 text-sm font-mono">${m(e.voucher_code)}</span></div>
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Lo\u1EA1i ch\u1EE9ng t\u1EEB:</span> <span class="font-medium text-gray-900 dark:text-white">${m(e.invoice_type)}</span></div>
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">\u0110i\u1EC3m nh\u1EADn:</span> <span class="font-medium text-gray-900 dark:text-white">${m(e.site_name)}</span></div>
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Nh\xE0 cung c\u1EA5p:</span> <span class="font-medium text-gray-900 dark:text-white">${m(e.supplier_name||"\u2014")}</span></div>
          </div>
          <div class="p-3.5 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Ghi ch\xFA:</span>
            <p class="text-gray-800 dark:text-gray-200">${m(e.note||"Kh\xF4ng c\xF3 ghi ch\xFA")}</p>
          </div>
          <div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">T\u1EC7p t\xE0i li\u1EC7u \u0111\xEDnh k\xE8m:</span>
            <div class="space-y-2">
              ${e.files&&e.files.length?e.files.map(r=>`
                <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
                  <span class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="file-text" class="w-4 h-4 text-brand-500"></i>
                    <span>${m(r.file_name)}</span>
                  </span>
                  <a href="${m(r.file_link)}" target="_blank" class="btn btn-sm btn-secondary">M\u1EDF t\u1EC7p</a>
                </div>
              `).join(""):'<p class="text-xs text-gray-400 dark:text-gray-500 italic p-3 text-center bg-gray-50 dark:bg-gray-800/30 rounded-xl">Kh\xF4ng c\xF3 t\u1EC7p \u0111\xEDnh k\xE8m</p>'}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`Ch\u1EE9ng t\u1EEB ${t}`,n)}}catch(o){typeof showToast=="function"&&showToast("L\u1ED7i: "+o.message)}finally{typeof hideLoading=="function"&&hideLoading()}}var st=[];function Oa(){let t=document.getElementById("bcNguoiBaoCao"),o=document.getElementById("bcNguoiBaoCaoKhac");t&&o&&(t.value==="Kh\xE1c"?(o.classList.remove("hidden"),o.focus()):(o.classList.add("hidden"),o.value=""))}function ja(){let t=parseFloat(document.getElementById("bcSang")?.value||"0")||0,o=parseFloat(document.getElementById("bcTrua")?.value||"0")||0,a=parseFloat(document.getElementById("bcChieu")?.value||"0")||0,e=parseFloat(document.getElementById("bcNhanVien")?.value||"0")||0,n=parseFloat(document.getElementById("bcHuy")?.value||"0")||0,r=t+o+a+e+n,s=document.getElementById("bcTong");s&&(s.value=Math.round(r).toLocaleString("vi-VN"))}function Wa(t){let o=Array.from(t.files||[]),a=20*1024*1024;o.forEach(e=>{if(e.size>a){typeof showToast=="function"&&showToast(`\u1EA2nh "${e.name}" v\u01B0\u1EE3t qu\xE1 20MB, b\u1ECF qua.`);return}let n=URL.createObjectURL(e);st.push({name:e.name,size:e.size,previewUrl:n})}),Pt(),t.value=""}function Pt(){let t=document.getElementById("bcAnhList");if(!t)return;let o=typeof window<"u"&&window.bcAnhFiles?window.bcAnhFiles:st;if(!o.length){t.innerHTML="";return}t.innerHTML=o.map((a,e)=>`
    <div class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/80 aspect-square">
      <img src="${a.previewUrl}" class="w-full h-full object-cover">
      <button type="button" onclick="bcXoaAnh(${e})" class="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm" title="X\xF3a \u1EA3nh">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
      <div class="absolute bottom-0 inset-x-0 bg-slate-900/60 text-[10px] text-white px-1.5 py-0.5 truncate font-mono tabular-nums">${m(a.name)}</div>
    </div>
  `).join(""),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function Va(t){(typeof window<"u"&&window.bcAnhFiles?window.bcAnhFiles:st).splice(t,1),Pt()}function bn(){let t=document.getElementById("bcForm");t&&t.reset();let o=new Date,a=document.getElementById("bcNgay");a&&(a.value=o.toISOString().split("T")[0]);let e=document.getElementById("bcTong");e&&(e.value="0");let n=document.getElementById("bcNguoiBaoCaoKhac");n&&(n.classList.add("hidden"),n.value=""),st.length=0,typeof window<"u"&&(window.bcAnhFiles=st),Pt(),typeof showToast=="function"&&showToast("\u0110\xE3 l\xE0m m\u1EDBi form b\xE1o c\xE1o ca b\u1EBFp")}async function xn(){let t=document.getElementById("bcSite")?.value||"";if(!t){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Site \u1EDF thanh \u0111i\u1EC1u h\u01B0\u1EDBng ph\xEDa tr\xEAn!");return}let o=document.getElementById("bcNgay")?.value||"";if(!o){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Ng\xE0y b\xE1o c\xE1o!");return}let a=document.getElementById("bcNguoiBaoCao")?.value||"",e=document.getElementById("bcNguoiBaoCaoKhac")?.value.trim()||"",n=a==="Kh\xE1c"?e:a;if(!n){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn ho\u1EB7c nh\u1EADp Ng\u01B0\u1EDDi b\xE1o c\xE1o!");return}let r=parseFloat(document.getElementById("bcSang")?.value||"0")||0,s=parseFloat(document.getElementById("bcTrua")?.value||"0")||0,i=parseFloat(document.getElementById("bcChieu")?.value||"0")||0,l=parseFloat(document.getElementById("bcNhanVien")?.value||"0")||0,d=parseFloat(document.getElementById("bcHuy")?.value||"0")||0,c=r+s+i+l+d,u=document.getElementById("bcForm"),h={};u&&u.querySelectorAll("[name]").forEach(y=>{h[y.getAttribute("name")]=y.value}),typeof showLoading=="function"&&showLoading("\u0110ang g\u1EEDi b\xE1o c\xE1o v\u1EADn h\xE0nh ca b\u1EBFp...");let g=document.getElementById("btnGuiBaoCao");g&&(g.disabled=!0);try{let y=parseFloat(document.getElementById("bcStaffCoMat")?.value||"0")||0,p=parseFloat(document.getElementById("bcStaffVang")?.value||"0")||0,b={site:t,branchCode:t,reportDate:o,reporterName:n,plannedMeals:c,actualMeals:c-d,wastedMeals:d,staffActual:y,staffStandard:y+p,foodQualityNote:document.getElementById("bcTinhTrangNVL")?.value||"",feedback:document.getElementById("bcChiTietPhanHoi")?.value||"",extraCost:document.getElementById("bcPhatSinhChiPhi")?.value==="C\xF3"?1:0,images:st.map(w=>({name:w.name})),reportData:{...h,Site:t,"Ng\u01B0\u1EDDi b\xE1o c\xE1o":n,"T\u1ED5ng su\u1EA5t \u0103n \u0111\xE3 xu\u1EA5t":c,"\u1EA2nh \u0111\xEDnh k\xE8m":st.map(w=>w.name)}},x=await(await fetch("/api/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)})).json();x.success?(typeof openGeneralModal=="function"&&openGeneralModal("G\u1EEDi B\xE1o C\xE1o Th\xE0nh C\xF4ng",`
          <div class="text-center py-4 space-y-3">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-title-sm font-bold">\u2713</div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-100">\u0110\xE3 g\u1EEDi b\xE1o c\xE1o ca b\u1EBFp th\xE0nh c\xF4ng!</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Site: <b>${m(t)}</b> \xB7 Ng\xE0y: <b>${m(o)}</b></div>
            <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 inline-block font-mono tabular-nums text-xs">
              T\u1ED5ng su\u1EA5t \u0103n \u0111\xE3 xu\u1EA5t: <b class="text-emerald-700 text-sm font-semibold">${Math.round(c).toLocaleString("vi-VN")} su\u1EA5t</b>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">D\u1EEF li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF an to\xE0n tr\xEAn Cloudflare D1.</div>
            <button onclick="closeGeneralModal();" class="mt-2 px-6 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
              \u0110\xE3 Hi\u1EC3u
            </button>
          </div>
        `),bn()):typeof showToast=="function"&&showToast("L\u1ED7i: "+(x.error||"Kh\xF4ng th\u1EC3 l\u01B0u b\xE1o c\xE1o"))}catch(y){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+y.message)}finally{typeof hideLoading=="function"&&hideLoading(),g&&(g.disabled=!1)}}function Ka(){return xn()}var R=[],q=[];function wn(){typeof App<"u"&&(App.auditRawItems=R,App.auditItems=q),typeof window<"u"&&(window.auditRawItems=R,window.auditItems=q)}async function Xa(){let t=document.getElementById("kkSite")?.value||"";typeof showLoading=="function"&&showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA theo site...");try{let a=await(await fetch(`/api/inventory-audit?site=${encodeURIComponent(t)}&no-cache=1`)).json(),e=document.getElementById("kkBody"),n=document.getElementById("kkMobileCards");a.success&&a.data&&a.data.length?(R=a.data,q=a.data,wn(),vn(a.meta||{}),Ot()):(R=[],q=[],wn(),e&&(e.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">\u0110i\u1EC3m b\xE1n n\xE0y ch\u01B0a c\xF3 danh m\u1EE5c m\u1EB7t h\xE0ng n\xE0o trong dim_article_stock.</td></tr>'),n&&(n.innerHTML='<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">\u0110i\u1EC3m b\xE1n n\xE0y ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o.</div>'),xe(0,0),typeof updateAuditKpisAndChart=="function"&&updateAuditKpisAndChart([]))}catch(o){console.error("loadAudit error:",o),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i b\u1EA3ng ki\u1EC3m k\xEA: "+o.message)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function vn(t){let o=document.getElementById("kkNganhSelect"),a=document.getElementById("kkNhomSelect");if(!o||!a)return;let e=o.value,n=t&&t.nganh_hang&&t.nganh_hang.length?t.nganh_hang:Array.from(new Set(R.map(r=>r.nganh_hang).filter(Boolean))).sort();o.innerHTML='<option value="">-- T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng --</option>'+n.map(r=>`<option value="${m(r)}">${m(r)}</option>`).join(""),n.includes(e)&&(o.value=e),be()}function be(){let t=document.getElementById("kkNganhSelect"),o=document.getElementById("kkNhomSelect");if(!o)return;let a=t?t.value:"",e=[];a?e=Array.from(new Set(R.filter(n=>n.nganh_hang===a).map(n=>n.nhom_hang).filter(Boolean))).sort():e=Array.from(new Set(R.map(n=>n.nhom_hang).filter(Boolean))).sort(),o.innerHTML='<option value="">-- T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng --</option>'+e.map(n=>`<option value="${m(n)}">${m(n)}</option>`).join(""),Ot()}function Ot(){let o=(document.getElementById("kkSearchInput")?.value||"").trim().toLowerCase(),e=document.getElementById("kkNganhSelect")?.value||"",r=document.getElementById("kkNhomSelect")?.value||"",i=document.getElementById("kkPriceSelect")?.value||"ALL",d=document.getElementById("kkStatusSelect")?.value||"ALL",c=!!(o||e||r||i!=="ALL"||d!=="ALL"),u=document.getElementById("kkActiveFilterBadge");u&&u.classList.toggle("hidden",!c);let h=R.filter(g=>{if(o){let x=(g.item_code||"").toLowerCase().includes(o),w=(g.item_name||"").toLowerCase().includes(o),v=(g.nganh_hang||"").toLowerCase().includes(o),T=(g.nhom_hang||"").toLowerCase().includes(o);if(!x&&!w&&!v&&!T)return!1}if(e&&g.nganh_hang!==e||r&&g.nhom_hang!==r)return!1;let y=parseFloat(String(g.price||0))||0;if(i==="WITH_PRICE"&&y<=0||i==="NO_PRICE"&&y>0)return!1;let p=g.closing_t10||g.closing_t9||0,b=g.usage_t11,f=b!=null;if(d==="COUNTED"&&!f||d==="UNCOUNTED"&&f)return!1;if(d==="DIFF"){let x=p-(b||0);if(Math.abs(x-p)<1e-4&&(!b||b===0))return!1}return!0});q=h,wn(),kn(h),xe(h.length,R.length),typeof updateAuditKpisAndChart=="function"&&updateAuditKpisAndChart(h)}function qa(t){let o=document.getElementById("kkStatusSelect");o&&(o.value=t),Ot()}function Ua(){let t=document.getElementById("kkSearchInput"),o=document.getElementById("kkNganhSelect"),a=document.getElementById("kkNhomSelect"),e=document.getElementById("kkPriceSelect"),n=document.getElementById("kkStatusSelect"),r=document.getElementById("kkDiscrepancyFilter");t&&(t.value=""),o&&(o.value=""),a&&(a.value=""),e&&(e.value="ALL"),n&&(n.value="ALL"),r&&(r.value="ALL"),be()}function xe(t,o){let a=document.getElementById("kkFilteredCount"),e=document.getElementById("kkTotalCount");a&&(a.textContent=Math.round(t).toLocaleString("vi-VN")),e&&(e.textContent=Math.round(o).toLocaleString("vi-VN"))}function kn(t){let o=document.getElementById("kkBody"),a=document.getElementById("kkMobileCards"),e=t||q;if(!e||!e.length){o&&(o.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc / t\u1EEB kh\xF3a.</td></tr>'),a&&(a.innerHTML='<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}o&&(o.innerHTML=e.map(n=>{let r=n.closing_t10||n.closing_t9||0,s=n.usage_t11!==null&&n.usage_t11!==void 0?n.usage_t11:0,i=r-s,l=parseFloat(String(n.price||0))||0,d=i*l,c=n.nhom_hang&&n.nhom_hang!=="Ch\u01B0a ph\xE2n lo\u1EA1i"?n.nhom_hang:n.nganh_hang||"V\u1EADt t\u01B0";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="col-code">${kt(n.item_code)}</td>
          <td>
            <div class="font-medium text-gray-900 dark:text-white text-xs">${m(n.item_name)}</div>
            <div class="code text-gray-400 dark:text-gray-500 text-[10px] font-mono">${m(n.warehouse_code||"Kho")}</div>
          </td>
          <td>
            <span class="badge badge-neutral max-w-[160px] truncate text-xs" title="${m(c)}">
              ${m(c)}
            </span>
          </td>
          <td class="text-center text-gray-600 dark:text-gray-300 font-medium text-xs">${m(n.unit||"")}</td>
          <td class="col-num text-right num font-mono text-xs">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":'<span class="text-gray-400">0 \u20AB</span>'}</td>
          <td class="col-num text-right num font-medium text-gray-900 dark:text-white font-mono text-xs">${Math.round(r).toLocaleString("vi-VN")}</td>
          <td class="text-right">
            <input type="number" min="0" step="any" value="${s}"
              class="input num text-right h-8 py-1 w-24 text-xs font-mono"
              oninput="onAuditChange(${n.id}, this.value, ${r}, ${l})">
          </td>
          <td class="col-num text-right num font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs" id="aud-close-${n.id}">${Math.round(i).toLocaleString("vi-VN")}</td>
          <td class="col-num text-right num font-semibold text-gray-900 dark:text-white font-mono text-xs" id="aud-value-${n.id}">${Math.round(d).toLocaleString("vi-VN")} \u20AB</td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(n=>{let r=n.closing_t10||n.closing_t9||0,s=n.usage_t11!==null&&n.usage_t11!==void 0?n.usage_t11:0,i=r-s,l=parseFloat(String(n.price||0))||0,d=i*l,c=n.nhom_hang&&n.nhom_hang!=="Ch\u01B0a ph\xE2n lo\u1EA1i"?n.nhom_hang:n.nganh_hang||"V\u1EADt t\u01B0";return`
        <div class="data-card space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-medium text-sm text-gray-900 dark:text-white">${m(n.item_name)}</div>
              <div class="code text-gray-400 mt-0.5 text-xs font-mono">M\xE3: ${m(n.item_code)} \u2022 \u0110VT: ${m(n.unit||"")} \u2022 Gi\xE1: <span class="num">${Math.round(l).toLocaleString("vi-VN")} \u20AB</span></div>
            </div>
            <span class="badge badge-neutral shrink-0 max-w-[120px] truncate text-xs">${m(c)}</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">T\u1ED3n \u0111\u1EA7u k\u1EF3</div>
              <div class="num font-semibold text-gray-900 dark:text-white font-mono">${Math.round(r).toLocaleString("vi-VN")}</div>
            </div>
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">S\u1EED d\u1EE5ng k\u1EF3</div>
              <input type="number" min="0" step="any" value="${s}"
                class="input num text-center h-8 py-1 w-full text-xs font-mono"
                oninput="onAuditChange(${n.id}, this.value, ${r}, ${l}); const c = document.getElementById('aud-mob-close-${n.id}'); if(c) c.innerText = Math.round(${r} - (parseFloat(this.value)||0)).toLocaleString('vi-VN'); const v = document.getElementById('aud-mob-value-${n.id}'); if(v) v.innerText = Math.round((${r} - (parseFloat(this.value)||0)) * ${l}).toLocaleString('vi-VN') + ' \u20AB';">
            </div>
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">T\u1ED3n cu\u1ED1i k\u1EF3</div>
              <div class="num font-semibold text-brand-600 dark:text-brand-400 font-mono" id="aud-mob-close-${n.id}">${Math.round(i).toLocaleString("vi-VN")}</div>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 px-1">
            <span class="text-gray-500 dark:text-gray-400">Th\xE0nh ti\u1EC1n t\u1ED3n:</span>
            <span class="num font-semibold text-gray-900 dark:text-white font-mono" id="aud-mob-value-${n.id}">${Math.round(d).toLocaleString("vi-VN")} \u20AB</span>
          </div>
        </div>
      `}).join(""))}function Ga(t,o,a,e=0){let n=R.find(r=>r.id==t);if(n){n.usage_t11=o===""?null:parseFloat(o)||0;let r=a-(n.usage_t11||0),s=document.getElementById(`aud-close-${t}`);s&&(s.textContent=Math.round(r).toLocaleString("vi-VN"));let i=document.getElementById(`aud-value-${t}`);i&&(i.textContent=Math.round(r*(parseFloat(String(n.price))||e||0)).toLocaleString("vi-VN")+" \u20AB")}}async function Qa(){if(!R||!R.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 l\u01B0u!");return}typeof showLoading=="function"&&showLoading("L\u01B0u k\u1EBFt qu\u1EA3 ki\u1EC3m k\xEA...");try{let t={items:R.map(e=>{let n=e.closing_t10||e.closing_t9||0,r=e.usage_t11!==null&&e.usage_t11!==void 0?e.usage_t11:0;return{id:e.id,site_code:e.site_code,item_code:e.item_code,item_name:e.item_name,unit:e.unit,usage:r,closing:n-r}})},a=await(await fetch("/api/inventory-audit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json();a.success?typeof showToast=="function"&&showToast("L\u01B0u k\u1EBFt qu\u1EA3 ki\u1EC3m k\xEA th\xE0nh c\xF4ng!"):typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+(a.error||"Th\u1EA5t b\u1EA1i"))}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function za(){if(!q||!q.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u \u0111\u1EC3 xu\u1EA5t Excel!");return}let t=["M\xE3 H\xE0ng","T\xEAn H\xE0ng H\xF3a","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","Kho","\u0110VT","\u0110\u01A1n Gi\xE1 (\u20AB)","T\u1ED3n K\u1EF3 Tr\u01B0\u1EDBc","S\u1EED D\u1EE5ng K\u1EF3","T\u1ED3n Cu\u1ED1i K\u1EF3","Th\xE0nh Ti\u1EC1n T\u1ED3n (\u20AB)"],o=q.map(n=>{let r=n.closing_t10||n.closing_t9||0,s=n.usage_t11!==null&&n.usage_t11!==void 0?n.usage_t11:0,i=r-s,l=parseFloat(String(n.price||0))||0;return[n.item_code,n.item_name,n.nganh_hang||"",n.nhom_hang||"",n.warehouse_code||"Kho",n.unit||"",l,r,s,i,i*l]}),a=document.getElementById("kkSite")?.value||"Site",e=(typeof extractSiteCode=="function"?extractSiteCode(a):a)||"Site";typeof exportStyledExcel=="function"&&(exportStyledExcel(`Kiem_Ke_Ton_Kho_${e}.xlsx`,"KiemKe",t,o,[6,7,8,9,10],[0,4,5]),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o ki\u1EC3m k\xEA ${e} th\xE0nh c\xF4ng!`))}if(typeof window<"u"){let t=window;t.uploadedFiles=ut,t.onChonFile=hn,t.onSelectFiles=Ba,t.renderUploadedFiles=At,t.removeFile=Ha,t.resetChungTuForm=ye,t.resetVoucherForm=Na,t.luuChungTuForm=yn,t.saveVoucher=Fa,t.taiTemplateChungTu=Ra,t.importExcelChungTu=Da,t.searchVouchers=Aa,t.viewVoucherDetail=Pa,t.bcAnhFiles=st,t.bcNguoiBaoCaoChange=Oa,t.tinhTongSuat=ja,t.bcChonAnh=Wa,t.bcRenderAnh=Pt,t.bcXoaAnh=Va,t.resetBaoCao=bn,t.guiBaoCao=xn,t.submitCateringReport=Ka,t.auditRawItems=R,t.auditItems=q,t.loadAudit=Xa,t.populateAuditFilters=vn,t.onAuditNganhChange=be,t.filterAuditItems=Ot,t.onKkDiscrepancyFilterChange=qa,t.resetAuditFilters=Ua,t.updateAuditCounts=xe,t.renderAuditList=kn,t.onAuditChange=Ga,t.saveAudit=Qa,t.exportAuditExcel=za,t.fmtDate=fn,t.cellCode=kt,t.cellDate=Dt,t.cellBadge=ge,t.cellFiles=me,t.cellPerson=fe,t.cellSite=he,t.escapeHtml=m}console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{ne as STANDARD_STEPS,Ao as addEditOrderItemLine,Pn as addManualReceiptItem,Ut as addWasteLineRow,lr as api,q as auditItems,R as auditRawItems,st as bcAnhFiles,Wa as bcChonAnh,Oa as bcNguoiBaoCaoChange,Pt as bcRenderAnh,Va as bcXoaAnh,Et as calcBudget,Zt as canAuthenticateJourney,nt as canDeleteOrders,et as canEditOrders,ge as cellBadge,kt as cellCode,Dt as cellDate,me as cellFiles,fe as cellPerson,he as cellSite,Qo as changeStockPage,ta as clearStockSelection,Me as closeConfirmClearManualLinesModal,Te as closeCreateReceiptModal,He as closeCreateWasteModal,ae as closeDeleteOrderModal,Ge as closeEditOrderModal,bo as closeInvDetailModal,Ce as closeManualReceiptModal,Bt as closeModal,Ho as closeOrderJourneyModal,ln as closeWhReceivedOrderDetailModal,cn as confirmCancelReceivedOrder,Ie as confirmClearAllManualReceiptLines,Oo as confirmDeleteOrder,_o as currentJourneyData,$o as currentJourneyOrderCode,vt as currentPLData,ir as debounce,ga as downloadRopExcel,N as editOrderItems,m as escapeHtml,qn as executeClearAllManualReceiptLines,jo as executeDeleteOrder,za as exportAuditExcel,xo as exportCountSheetExcel,la as exportFefoToExcel,$a as exportFnbChainExcel,_a as exportFnbPLExcel,zt as exportFnbStockExcel,ca as exportSelectedStockExcel,va as exportWhInventoryToExcel,ka as exportWhItemHistoryToExcel,Ot as filterAuditItems,lt as filterFefoLive,Sa as filterFnbChainByRegion,qe as filterHsOrders,Lo as filterItems,en as filterLeadTimeSla,gt as filterManualCatalogList,pn as filterPlBreakdown,rn as filterWhInventoryTable,ba as filterWhReceivedOrdersTable,fn as fmtDate,It as formatBatchCode,ve as formatCompactVND,z as formatDate,sr as formatDateYMD,Ye as formatItemQty,L as formatNumber,it as formatReceiptDateYMD,Mt as formatUnit,S as formatVND,W as gChainRankings,Nt as gCurrentFilterRegion,G as gFnbStockData,H as gFnbStockFilter,Jt as gFnbStockSearchTerm,Ht as gWhActiveBatches,ot as gWhActiveHistory,rt as gWhCurrentReceivedDetail,ct as gWhFilteredInventory,j as gWhInventoryData,at as gWhReceivedOrders,J as getActiveFnbCountSite,K as getActiveFnbReceiptSite,X as getActiveFnbWasteSite,Y as getAppItems,ze as getDangerBadgeClass,Ko as getDaysRemainingMobileText,Vo as getDaysRemainingText,Je as getDaysTextColor,Wo as getExpBadgeClass,Xo as getExpDateColor,P as getReceiptExpWarningHtml,qo as getSelectedStockSkus,Uo as getStockCurrentPage,ed as getWhActiveBatches,td as getWhActiveHistory,zi as getWhFilteredInventory,Qi as getWhInventoryData,ad as getWhReceivedOrders,xn as guiBaoCao,Es as handleExportFnbStockExcel,Da as importExcelChungTu,Xa as loadAudit,ma as loadDashboardSummary,un as loadFnbChain,Za as loadFnbCounts,Re as loadFnbCountsHistory,pe as loadFnbPL,Ia as loadFnbPOS,dt as loadFnbPoList,Tn as loadFnbReceipts,Nn as loadFnbReceiptsHistory,Ma as loadFnbSites,De as loadFnbStock,Ya as loadFnbWaste,_e as loadFnbWasteHistory,Io as loadHistory,pa as loadLeadTime,St as loadManualCatalogItems,We as loadQuota,ua as loadReorderROP,de as loadStockFEFO,qt as loadWasteModalItems,sn as loadWhInventory,ue as loadWhReceivedOrders,yn as luuChungTuForm,Ga as onAuditChange,be as onAuditNganhChange,hn as onChonFile,mo as onCountInputChange,fo as onCountNoteChange,uo as onFnbCountDateChange,lo as onFnbCountFilterChange,io as onFnbCountNganhHangChange,co as onFnbCountSearch,po as onFnbCountSiteChange,Cn as onFnbPoSearchInput,wo as onFnbStockFilterChange,vo as onFnbStockSearch,ko as onFnbStockToggleValue,zn as onFnbWasteFilterChange,Qn as onFnbWasteNganhHangChange,Jn as onFnbWasteSearch,Yn as onFnbWasteSiteChange,qa as onKkDiscrepancyFilterChange,Wn as onManualLineBatchChange,Vn as onManualLineExpChange,Xn as onManualLineLocChange,jn as onManualLinePriceChange,On as onManualLineQtyChange,Dn as onManualReceiptSiteChange,So as onQtyChange,In as onReceiptLineBatchChange,Mn as onReceiptLineExpChange,_n as onReceiptLineNoteChange,En as onReceiptLineQtyChange,Ta as onSearchChainSite,Ba as onSelectFiles,Ea as onSelectPLSite,eo as onWasteLineNoteChange,Zn as onWasteLineQtyChange,to as onWasteLineReasonChange,ro as onWasteModalItemSelect,Ne as onWasteModalLineQtyInput,ao as onWasteModalSiteChange,wa as onWhRecModalCancelClick,Bn as openCreateReceiptModal,oo as openCreateWasteModal,ra as openEditItemModal,Fo as openEditOrderModal,na as openIssueModal,ia as openItemDetailModal,Rn as openManualReceiptModal,Bo as openOrderJourneyModal,Le as openPoReceiptModal,ea as openReceiptModal,ha as openWhItemBatchesModal,fa as openWhItemHistoryModal,xa as openWhReceivedOrderDetail,wt as parseQty,Ue as pendingDeleteOrderCode,vn as populateAuditFilters,Gt as populateFnbCountFilters,Qt as populateFnbCountNhomHangDropdown,Be as populateFnbWasteFilters,Kt as populateFnbWasteNhomHangDropdown,$e as populateFnbWasteSiteDropdown,dn as populateWhReceivedOrdersSiteFilter,Qe as recalcEditOrderTotals,Fe as recalculateWasteModalTotal,Do as removeEditOrderItemLine,Ha as removeFile,Ee as removeManualReceiptLine,kn as renderAuditList,xt as renderEditOrderItems,Ze as renderFefoRows,Ft as renderFnbChainTable,U as renderFnbCountsTable,gn as renderFnbPL,mn as renderFnbPOS,Wt as renderFnbPoTable,Rt as renderFnbSites,Tt as renderFnbStock,yt as renderFnbWasteStockTable,ee as renderHsOrdersList,te as renderJourneyBadge,oe as renderJourneyTimeline,le as renderLeadTimeTable,ft as renderManualReceiptLinesTable,Ct as renderOrderTable,Se as renderReceiptLinesTable,tn as renderRopTable,on as renderStockAlertsTable,At as renderUploadedFiles,ce as renderWhReceivedOrdersTable,Ua as resetAuditFilters,bn as resetBaoCao,ye as resetChungTuForm,Jo as resetFefoFilters,Na as resetVoucherForm,To as reviewOrder,Qa as saveAudit,Po as saveEditOrder,ho as saveFnbCountAudit,sa as saveItemSpecs,Fa as saveVoucher,Aa as searchVouchers,D as selectedStockSkus,Yt as setAppItems,Kn as setManualLineQuickExp,$n as setReceiptLineQuickExp,Go as setStockCurrentPage,zo as sortStockBy,Ka as submitCateringReport,Hn as submitCreateReceipt,so as submitCreateWaste,no as submitDirectWaste,aa as submitIssueToBackend,No as submitJourneyStep,Un as submitManualReceipt,Co as submitOrder,oa as submitReceiptToBackend,mt as switchFnbReceiptSubView,ht as switchFnbWasteSubView,ya as switchWhInvSubView,Ra as taiTemplateChungTu,ja as tinhTongSuat,go as toggleBlindCount,An as toggleManualShowAllCatalog,Yo as toggleSelectAllStock,Zo as toggleStockItemSelect,La as triggerSyncFnbMonthlySummary,nn as updateApexChartsTheme,xe as updateAuditCounts,Ro as updateEditOrderItemQty,Vt as updateManualTotals,_t as updateStockBulkBar,an as updateTailadminDashboard,Xt as updateWasteKPIs,ut as uploadedFiles,yo as viewCountDetail,Mo as viewOrderDetail,Fn as viewReceiptDetail,Ca as viewSitePL,Pa as viewVoucherDetail,Gn as viewWasteDetail};
