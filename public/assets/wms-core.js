function ct(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function $t(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let e=Number(t),o=Math.abs(e),n=e<0?"-":"",a=e.toLocaleString("vi-VN")+" \u20AB";if(o>=1e9){let i=(o/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:n+i,unit:"t\u1EF7 \u20AB",full:a}}else if(o>=1e6){let i=(o/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:n+i,unit:"tr \u20AB",full:a}}else return{val:n+o.toLocaleString("vi-VN"),unit:"\u20AB",full:a}}function Hn(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let e=new Date(t);if(isNaN(e.getTime()))return String(t);let o=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${o}-${n}-${a}`}catch{return String(t)}}function ie(t){if(!t)return"\u2014";try{let e=new Date(t);if(isNaN(e.getTime()))return String(t);let o=String(e.getDate()).padStart(2,"0"),n=String(e.getMonth()+1).padStart(2,"0"),a=e.getFullYear();return`${o}/${n}/${a}`}catch{return String(t)}}function ut(t,e=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:e})}function u(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Fn(t,e=200){let o=null;return function(...n){o&&clearTimeout(o),o=setTimeout(()=>{t.apply(this,n)},e)}}var _t=class{cache=new Map;defaultTtl=3e4;async get(e,o=this.defaultTtl){let n=Date.now(),a=this.cache.get(e);if(a&&n-a.timestamp<o)return n-a.timestamp>1e4&&fetch(e).then(i=>i.json()).then(i=>{i.success&&this.cache.set(e,{timestamp:Date.now(),data:i})}).catch(()=>{}),a.data;try{let s=await(await fetch(e)).json();return s.success&&this.cache.set(e,{timestamp:n,data:s}),s}catch(i){return{success:!1,error:i instanceof Error?i.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(e,o){this.cache.clear();try{return await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json()}catch(n){return{success:!1,error:n instanceof Error?n.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(e){if(!e){this.cache.clear();return}for(let o of this.cache.keys())o.includes(e)&&this.cache.delete(o)}async getPoList(e,o="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(o)}`)}async getPoDetails(e){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}`)}async getReceiptHistory(e){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(e)}`)}async getInventory(e){return this.get(`/api/wh/inventory?site=${encodeURIComponent(e)}`)}async submitManualReceipt(e){return this.post("/api/fnb/manual-receipt",e)}},Rn=new _t;function F(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let e=window,o=typeof e.App<"u"&&e.App.currentBranch?e.App.currentBranch.toUpperCase():"K001";return o==="ALL"||!o?"K001":o}function G(t){if(!t||t==="\u2014")return"\u2014";let e=String(t).trim(),o=e.match(/^(\d{4})-(\d{2})-(\d{2})/);if(o)return`${o[1]}-${o[2]}-${o[3]}`;try{let n=new Date(e);if(!isNaN(n.getTime())){let a=n.getFullYear(),i=String(n.getMonth()+1).padStart(2,"0"),s=String(n.getDate()).padStart(2,"0");return`${a}-${i}-${s}`}}catch{}return e.slice(0,10)}function N(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let e=new Date;e.setHours(0,0,0,0);let o=new Date(t);o.setHours(0,0,0,0);let n=Math.ceil((o.getTime()-e.getTime())/(1e3*60*60*24));return n<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(n)} ng\xE0y)</span>`:n===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':n<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${n} ng\xE0y)</span>`:n<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${n} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${n} ng\xE0y</span>`}function z(t){window.gFnbReceiptCurrentView=t;let e=document.getElementById("fnbReceiptTabBtnPo"),o=document.getElementById("fnbReceiptTabBtnHistory"),n=document.getElementById("fnbPoListView"),a=document.getElementById("fnbReceiptHistoryView");t==="po"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),n&&n.classList.remove("hidden"),a&&a.classList.add("hidden"),Q()):(o&&(o.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),e&&(e.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),n&&n.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function de(t){let e=t||F(),o=document.getElementById("fnbReceiptFilterSite");o&&(o.value=e);let a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(r=>r.code.toUpperCase()===e.toUpperCase()),i=a?a.ten||a.name:e,s=document.getElementById("fnbReceiptCurrentSiteBadge");s&&(s.textContent=i),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(e):await Q(e)}function le(t){gt(t)}async function Q(t){let e=t||F(),o=document.getElementById("fnbPoStatusFilter"),n=o?o.value:"OPEN",a=document.getElementById("fnbPoSummaryText");try{a&&(a.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${e}...`);let s=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(n)}&no-cache=1`)).json();if(s.success&&s.data){window.gFnbPoList=s.data;let r=document.getElementById("fnbPoSearchInput")?.value||"";gt(r);let d=(window.gFnbPoList||[]).filter(g=>g.status==="OPEN").length,l=document.getElementById("fnbReceiptBadgePendingCount");l&&(l.textContent=String(d))}else throw new Error(s.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(i){console.error("loadFnbPoList error:",i),a&&(a.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+i.message)}}function gt(t=""){let e=document.getElementById("fnbPoTableBody"),o=document.getElementById("fnbPoMobileCards"),n=document.getElementById("fnbPoSummaryText"),a=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),i=(t||"").toLowerCase().trim(),s=window.gFnbPoList||[];a&&(s=s.filter(r=>{let d=(r.supplier_name||"").toLowerCase();return a==="siba"?d.includes("siba")||d.includes("b\u1EBFp trung t\xE2m")||d.includes("trung t\xE2m"):a==="baf"?d.includes("baf")||d.includes("th\u1ECBt"):a==="spice"?d.includes("gia v\u1ECB")||d.includes("\u0111\u01B0\u1EDDng")||d.includes("unilever")||d.includes("cholimex")||d.includes("mu\u1ED1i"):a==="veg"?d.includes("rau")||d.includes("\u0111\xE0 l\u1EA1t")||d.includes("c\u1EE7"):!0})),i&&(s=s.filter(r=>{let d=(r.po_number||"").toLowerCase(),l=(r.supplier_name||"").toLowerCase(),g=(r.supplier_code||"").toLowerCase();return d.includes(i)||l.includes(i)||g.includes(i)})),n&&(n.textContent=`Hi\u1EC3n th\u1ECB ${s.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),e&&(s.length===0?e.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':e.innerHTML=s.map(r=>{let d=r.status==="OPEN",l=r.status==="COMPLETED",g=l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',f=(r.po_number||"").startsWith("50000")||!r.supplier_code||r.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',b=Number(r.total_amount)||0,h=Number(r.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${u(r.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${u(G(r.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${f}
                <span class="font-medium text-gray-900 dark:text-white">${u(r.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${r.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${u(r.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${r.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${h.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${g}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${u(r.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${l?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${l?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),o&&(s.length===0?o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':o.innerHTML=s.map(r=>{let d=r.status==="COMPLETED",l=(r.po_number||"").startsWith("50000")||!r.supplier_code||r.supplier_name==="B\u1EBFp Trung T\xE2m Siba",g=Number(r.total_amount)||0,m=Number(r.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${l?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${l?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${u(r.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${u(r.po_number)} \u2022 ${u(G(r.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${d?"text-emerald-600":"text-amber-600"} block">${d?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${r.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${m.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${g>0?Math.round(g).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${u(r.po_number)}')" class="w-full py-2 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${d?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${d?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Bt(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let o=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let n=o.data;if(!n.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let a=n[0],i=document.getElementById("receiptModalInvoice"),s=document.getElementById("receiptModalInvoiceDisplay"),r=document.getElementById("receiptModalSite"),d=document.getElementById("receiptModalSiteDisplay"),l=document.getElementById("receiptModalSupplier"),g=document.getElementById("receiptModalSupplierDisplay"),m=document.getElementById("receiptModalDate"),f=new Date().toISOString().slice(0,10);i&&(i.value=a.po_number),s&&(s.textContent=a.po_number),r&&(r.value=a.site),d&&(d.textContent=a.site),l&&(l.value=a.supplier_name),g&&(g.textContent=a.supplier_name),m&&(m.value=f);let b="L\xD4-"+f.replace(/-/g,"").slice(2),h=new Date;h.setFullYear(h.getFullYear()+1);let c=h.toISOString().slice(0,10);window.gReceiptLines=n.map(p=>{let x=(p.merch_category||"").toLowerCase(),v=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:p.po_item,item_code:p.item_code,item_name:p.item_name,merch_category:p.merch_category,unit:p.unit||"KG",unit_price:Number(p.unit_price)||0,order_qty:Number(p.order_qty)||0,actual_qty:Number(p.order_qty)||0,batch_code:b,exp_date:v?c:"",is_food:v,note:""}}),Nt();let y=document.getElementById("createReceiptModal");y&&y.classList.remove("hidden")}catch(e){console.error("openPoReceiptModal error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Nt(){let t=document.getElementById("receiptLinesTableBody"),e=document.getElementById("receiptLinesMobileCards"),o=document.getElementById("receiptModalLineCount"),n=document.getElementById("receiptModalTotalAmount"),a=window.gReceiptLines||[];o&&(o.textContent=String(a.length));let i=0;t&&(t.innerHTML=a.map((s,r)=>{let d=(s.actual_qty||0)*(s.unit_price||0);return i+=d,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${r+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${u(s.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${u(s.item_code)}</span>
              ${s.merch_category?`<span>\u2022</span><span>${u(s.merch_category)}</span>`:""}
              ${s.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${u(s.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(s.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${r}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${u(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${r}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${r}" value="${s.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${r}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${r}" class="mt-1">
                ${N(s.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${r}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${d>0?Math.round(d).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${u(s.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${r}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=a.map((s,r)=>{let d=(s.actual_qty||0)*(s.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${u(s.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${u(s.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${u(s.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${r+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(s.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${r}" class="num font-bold text-brand-600 dark:text-brand-400">${d>0?Math.round(d).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
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
                     oninput="onReceiptLineQtyChange(${r}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${u(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${r}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${r}" value="${s.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${r}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${r}" class="mt-1">
                ${N(s.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${u(s.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${r}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),n&&(n.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function ce(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=parseFloat(e);window.gReceiptLines[t].actual_qty=isNaN(o)?0:o;let n=window.gReceiptLines[t],a=(n.actual_qty||0)*(n.unit_price||0),i=document.getElementById(`receiptLineTotal_${t}`);i&&(i.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let s=document.getElementById(`receiptLineTotalMob_${t}`);s&&(s.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let r=0;window.gReceiptLines.forEach(l=>{r+=(l.actual_qty||0)*(l.unit_price||0)});let d=document.getElementById("receiptModalTotalAmount");d&&(d.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function ue(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=e)}function ge(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=e;let o=document.getElementById(`receiptExpWarning_${t}`);o&&(o.innerHTML=N(e));let n=document.getElementById(`receiptExpWarningMob_${t}`);n&&(n.innerHTML=N(e)),window.lucide&&window.lucide.createIcons()}function pe(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+e);let n=o.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=n;let a=document.getElementById(`receiptLineExpInput_${t}`);a&&(a.value=n);let i=document.getElementById(`receiptLineExpInputMob_${t}`);i&&(i.value=n);let s=document.getElementById(`receiptExpWarning_${t}`);s&&(s.innerHTML=N(n));let r=document.getElementById(`receiptExpWarningMob_${t}`);r&&(r.innerHTML=N(n)),window.lucide&&window.lucide.createIcons()}function me(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=e)}function Ht(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function fe(){window.gFnbPoList&&window.gFnbPoList.length?Bt(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function be(){let e=(window.gReceiptLines||[]).filter(f=>(f.actual_qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=new Date;o.setHours(0,0,0,0);let n=!1;for(let f of e)if(f.exp_date){let b=new Date(f.exp_date);if(b.setHours(0,0,0,0),b<=o){n=!0;break}}if(n&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let a=document.getElementById("receiptModalSite")?.value||F(),i=document.getElementById("receiptModalInvoice")?.value||"",s=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),r=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",d=document.getElementById("receiptModalNotes")?.value||"",l=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",g={site_code:a,receipt_date:s,supplier:r,invoice_no:i,notes:d,created_by:l,lines:e.map(f=>({item_code:f.item_code,qty:f.actual_qty,unit_price:f.unit_price,batch_code:(f.batch_code||"").trim(),exp_date:(f.exp_date||"").trim()||null,note:f.note||""}))},m=document.getElementById("btnSubmitReceipt");m&&(m.disabled=!0,m.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let b=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)})).json();if(!b.success)throw new Error(b.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${b.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Ht(),await Q(a),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(a),z("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(f){console.error("submitCreateReceipt error:",f),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+f.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),m&&(m.disabled=!1,m.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function he(t){let e=t||F(),o=document.getElementById("fnbReceiptsTableBody"),n=document.getElementById("fnbReceiptsMobileCards");try{let i=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(i.success&&i.data){let s=i.data.receipts||[],r=document.getElementById("fnbReceiptBadgeHistoryCount");r&&(r.textContent=String(s.length)),o&&(s.length?o.innerHTML=s.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${u(d.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${u(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${u(G(d.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${u(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${u(d.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${u(d.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${u(e)}.</td></tr>`),n&&(s.length?n.innerHTML=s.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${u(d.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${u(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${u(G(d.receipt_date))} \u2022 PO: ${u(d.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${u(d.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(a){console.error("loadFnbReceiptsHistory error:",a)}}async function ye(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let n=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),s&&(s.textContent=`${n.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let r=`
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
            ${n.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${u(l.item_name||l.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${u(l.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${u(l.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${l.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${u(l.exp_date?String(l.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${u(l.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=r),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function xe(t){let e=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||F()||"K001",n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(y=>y.code.toUpperCase()===e.toUpperCase()),a=n?n.ten||n.name:e,i=a.startsWith(e)?a:`${e} - ${a}`,s=document.getElementById("manualReceiptSiteNameDisplay");s&&(s.textContent=i);let r=document.getElementById("manualReceiptSiteSelect");r&&(r.value=e);let d=document.getElementById("manualReceiptSiteBadge");d&&(d.textContent=e);let l=document.getElementById("manualReceiptDate");l&&(l.value=new Date().toISOString().slice(0,10));let g=document.getElementById("manualReceiptSupplier");g&&!g.value&&(g.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let m=document.getElementById("manualReceiptInvoiceNo");m&&(m.value="");let f=document.getElementById("manualReceiptNotes");f&&(f.value="");let b=document.getElementById("manualItemSearchInput");b&&(b.value="");let h=document.getElementById("manualItemCategorySelect");h&&(h.value=""),window.gManualReceiptLines=[],Y();let c=document.getElementById("modalManualReceipt");c&&c.classList.remove("hidden"),await at(e,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function Ft(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function we(t){let e=document.getElementById("manualReceiptSiteBadge");e&&(e.textContent=t),await at(t,window.gManualShowAllCatalog)}async function ve(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let e=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await at(e,window.gManualShowAllCatalog)}async function at(t,e){let o=document.getElementById("manualCatalogListContainer");o&&(o.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let n=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${e?"&include_all=1":""}`,i=await(await fetch(n)).json();i.success&&i.data?window.gManualSiteCatalog=i.data.items||[]:window.gManualSiteCatalog=[],X()}catch(n){console.error("loadManualCatalogItems error:",n),o&&(o.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${u(n.message)}</div>`)}}function X(){let t=document.getElementById("manualCatalogListContainer"),e=document.getElementById("manualCatalogCountText"),o=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),n=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),a=window.gManualSiteCatalog||[];if(o&&(a=a.filter(i=>{let s=(i.code||i.sku||"").toLowerCase(),r=(i.name||"").toLowerCase();return s.includes(o)||r.includes(o)})),n&&(a=a.filter(i=>(i.nhom_hang||i.item_group||i.nganh_hang||"").toLowerCase().includes(n))),e&&(e.textContent=String(a.length)),!!t){if(!a.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${o?`v\u1EDBi t\u1EEB kh\xF3a "${u(o)}"`:""}.
      </div>
    `;return}t.innerHTML=a.map(i=>{let s=i.code||i.sku,r=(window.gManualReceiptLines||[]).find(g=>g.item_code===s),d=parseFloat(i.book_qty||0),l=parseFloat(i.unit_price||0);return`
      <div onclick="addManualReceiptItem('${s}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${r?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${u(i.name||s)}">
              ${u(i.name||s)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${u(i.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${u(s)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${d>0?"text-emerald-600":"text-gray-500"} font-mono">${d.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${l>0?Math.round(l).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${r?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${r.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function ke(t){let e=(window.gManualSiteCatalog||[]).find(n=>(n.code||n.sku)===t);if(!e)return;let o=(window.gManualReceiptLines||[]).find(n=>n.item_code===t);if(o)o.qty=Math.round((o.qty+1)*100)/100;else{let a="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),i=new Date;i.setFullYear(i.getFullYear()+1);let s=i.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:e.code||e.sku,item_name:e.name||e.code,unit:e.unit||"Ph\u1EA7n",unit_price:parseFloat(e.unit_price||0),qty:1,batch_code:a,exp_date:s,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}Y(),X()}function Y(){let t=document.getElementById("manualLinesEmptyState"),e=document.getElementById("manualLinesTableWrapper"),o=document.getElementById("manualLinesMobileCards"),n=document.getElementById("btnClearAllManualLines"),a=document.getElementById("manualLinesTableBody"),i=document.getElementById("manualSelectedCountText"),s=document.getElementById("manualSummaryTotalSkus"),r=document.getElementById("manualSummaryTotalQty"),d=document.getElementById("manualSummaryTotalAmount"),l=window.gManualReceiptLines||[];if(i&&(i.textContent=String(l.length)),s&&(s.textContent=l.length+" m\xE3"),!l.length){t&&t.classList.remove("hidden"),e&&(e.classList.add("hidden"),e.classList.remove("lg:block")),o&&(o.classList.add("hidden"),o.classList.remove("block")),n&&(n.classList.add("hidden"),n.classList.remove("flex")),r&&(r.textContent="0"),d&&(d.textContent="0 \u0111");return}t&&t.classList.add("hidden"),e&&(e.classList.remove("hidden"),e.classList.add("lg:block")),o&&(o.classList.remove("hidden"),o.classList.add("block")),n&&(n.classList.remove("hidden"),n.classList.add("flex"));let g=0,m=0;a&&(a.innerHTML=l.map((f,b)=>{let h=(f.qty||0)*(f.unit_price||0);return g+=f.qty||0,m+=h,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${b+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${u(f.item_name)}">
              ${u(f.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${u(f.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${u(f.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${f.qty}" 
                   oninput="onManualLineQtyChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${f.unit_price}" 
                   oninput="onManualLinePriceChange(${b}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${b}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${u(f.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${f.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${u(f.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=l.map((f,b)=>{let h=(f.qty||0)*(f.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${b+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${u(f.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${u(f.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${u(f.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${f.qty}" 
                     oninput="onManualLineQtyChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${f.unit_price}" 
                     oninput="onManualLinePriceChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${h>0?Math.round(h).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${u(f.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${f.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),r&&(r.textContent=g>0?Number.isInteger(g)?String(g):g.toFixed(1):"0"),d&&(d.textContent=m>0?Math.round(m).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Le(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(e);window.gManualReceiptLines[t].qty=isNaN(o)?0:o,pt()}function Ce(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(e);window.gManualReceiptLines[t].unit_price=isNaN(o)?0:o,pt()}function pt(){let t=0,e=0;(window.gManualReceiptLines||[]).forEach((a,i)=>{let s=(a.qty||0)*(a.unit_price||0);t+=a.qty||0,e+=s;let r=document.getElementById(`manualLineTotal_${i}`);r&&(r.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let o=document.getElementById("manualSummaryTotalQty"),n=document.getElementById("manualSummaryTotalAmount");o&&(o.textContent=t.toFixed(1)),n&&(n.textContent=Math.round(e).toLocaleString("vi-VN")+" \u0111")}function Se(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=e)}function Me(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=e;let o=document.getElementById(`manualLineExpWarning_${t}`);o&&(o.innerHTML=N(e),window.lucide&&window.lucide.createIcons())}function Ee(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+e);let n=o.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=n;let a=document.getElementById(`manualLineExpInput_${t}`);a&&(a.value=n);let i=document.getElementById(`manualLineExpWarning_${t}`);i&&(i.innerHTML=N(n),window.lucide&&window.lucide.createIcons())}function Te(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=e)}function Dt(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let e=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),Y(),typeof X=="function"&&X(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(e.item_name||e.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function Rt(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let e=document.getElementById("confirmClearManualCountText");e&&(e.textContent=String(t.length));let o=document.getElementById("modalConfirmClearManualLines");o&&(o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function Ot(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function Ie(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],Ot(),Y(),X(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function $e(){let e=(window.gManualReceiptLines||[]).filter(h=>(h.qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let o=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!o){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let n=new Date;n.setHours(0,0,0,0);let a=!1;for(let h of e)if(h.exp_date){let c=new Date(h.exp_date);if(c.setHours(0,0,0,0),c<=n){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let i=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",s=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),r=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",d=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",l=(document.getElementById("manualReceiptNotes")?.value||"").trim(),g=`[${r}] ${l}`.trim(),m=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",f={site_code:i,receipt_date:s,supplier:o,invoice_no:d,notes:g,created_by:m,lines:e.map(h=>({item_code:h.item_code,qty:h.qty,unit_price:h.unit_price,batch_code:(h.batch_code||"").trim(),exp_date:(h.exp_date||"").trim()||null,storage_loc:h.storage_loc||"K\u1EC7 B\u1EBFp",note:h.note||""}))},b=document.getElementById("btnSubmitManualReceipt");b&&(b.disabled=!0,b.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${c.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Ft(),await Q(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),z("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(h){console.error("submitManualReceipt error:",h),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+h.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),b&&(b.disabled=!1,b.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var w=window;w.gFnbReceiptCurrentView=w.gFnbReceiptCurrentView||"po";w.gFnbPoList=w.gFnbPoList||[];w.gReceiptLines=w.gReceiptLines||[];w.gManualReceiptLines=w.gManualReceiptLines||[];w.gManualSiteCatalog=w.gManualSiteCatalog||[];w.gManualShowAllCatalog=w.gManualShowAllCatalog||!1;w.getActiveFnbReceiptSite=F;w.formatReceiptDateYMD=G;w.getReceiptExpWarningHtml=N;w.switchFnbReceiptSubView=z;w.loadFnbReceipts=de;w.onFnbPoSearchInput=le;w.loadFnbPoList=Q;w.renderFnbPoTable=gt;w.openPoReceiptModal=Bt;w.renderReceiptLinesTable=Nt;w.onReceiptLineQtyChange=ce;w.onReceiptLineBatchChange=ue;w.onReceiptLineExpChange=ge;w.setReceiptLineQuickExp=pe;w.onReceiptLineNoteChange=me;w.closeCreateReceiptModal=Ht;w.openCreateReceiptModal=fe;w.submitCreateReceipt=be;w.loadFnbReceiptsHistory=he;w.viewReceiptDetail=ye;w.openManualReceiptModal=xe;w.closeManualReceiptModal=Ft;w.onManualReceiptSiteChange=we;w.toggleManualShowAllCatalog=ve;w.loadManualCatalogItems=at;w.filterManualCatalogList=X;w.addManualReceiptItem=ke;w.renderManualReceiptLinesTable=Y;w.onManualLineQtyChange=Le;w.onManualLinePriceChange=Ce;w.updateManualTotals=pt;w.onManualLineBatchChange=Se;w.onManualLineExpChange=Me;w.setManualLineQuickExp=Ee;w.onManualLineLocChange=Te;w.removeManualReceiptLine=Dt;w.removeManualLine=Dt;w.confirmClearAllManualReceiptLines=Rt;w.clearAllManualReceiptLines=Rt;w.closeConfirmClearManualLinesModal=Ot;w.executeClearAllManualReceiptLines=Ie;w.submitManualReceipt=$e;function D(){let t=document.getElementById("globalBranchSelect")?.value,e=localStorage.getItem("orbit_user_site"),o=window,n=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbWasteFilterSite")?.value,i=t||e||n||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function At(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let e=t.value||D(),o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(n=>n.code!=="ALL");if(o&&o.length){let n="";o.forEach(a=>{n+=`<option value="${a.code}" ${a.code.toUpperCase()===e.toUpperCase()?"selected":""}>${a.name}</option>`}),t.innerHTML=n,e&&Array.from(t.options).some(a=>a.value===e)&&(t.value=e)}}function Z(t){let e=document.getElementById("subtab-fnb-waste-stock"),o=document.getElementById("subtab-fnb-waste-history"),n=document.getElementById("fnbWasteSubViewStock"),a=document.getElementById("fnbWasteSubViewHistory");t==="history"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),n&&n.classList.add("hidden"),a&&a.classList.remove("hidden")):(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),n&&n.classList.remove("hidden"),a&&a.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function Pt(t){let e=t||D(),o=document.getElementById("fnbWasteTableBody"),n=document.getElementById("fnbWasteMobileCards"),a=document.getElementById("fnbWasteBadgeHistoryCount");try{let s=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(s.success&&s.data){let r=s.data.wastes||[];a&&(a.textContent=String(r.length)),o&&(r.length?o.innerHTML=r.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(d.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${u(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${u(String(d.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${u(d.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${u(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${u(d.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${u(e)}.</td></tr>`),n&&(r.length?n.innerHTML=r.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(d.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${u(d.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${u(String(d.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${u(d.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${u(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbWasteHistory error:",i)}}async function _e(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let o=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let n=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),s&&(s.textContent=`${n.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let r=`
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
            ${n.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${u(l.item_name||l.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${u(l.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${u(l.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${u(l.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=r),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function jt(){let t=document.getElementById("fnbWasteNganhHangFilter"),e=document.getElementById("fnbWasteNhomHangFilter");if(!t||!e)return;let o=new Map;(window.gFnbWasteStockItems||[]).forEach(a=>{let i=(a.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),s=(a.nhom_hang||a.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(i)||o.set(i,new Set),o.get(i).add(s)}),window.gFnbWasteNganhMap=o;let n='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(a=>{n+=`<option value="${u(a)}">${u(a)}</option>`}),t.innerHTML=n,t.value="",mt("")}function mt(t){let e=document.getElementById("fnbWasteNhomHangFilter");if(!e)return;let o=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbWasteNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let n='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{n+=`<option value="${u(a)}">${u(a)}</option>`}),e.innerHTML=n,e.value=""}function Be(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";mt(t),tt()}function Ne(){tt()}function He(t){tt()}function Fe(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function tt(){let t=document.getElementById("fnbWasteStockTableBody"),e=document.getElementById("fnbWasteStockMobileCards"),o=document.getElementById("fnbWasteStockEmptyState"),n=document.getElementById("fnbWasteSummary"),a=document.getElementById("fnbWasteBadgeInStockCount"),i=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),d=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),l=window.gFnbWasteStockItems||[],g=document.getElementById("kpiWasteInStockCount"),m=document.getElementById("kpiWasteInStockVal");g&&(g.textContent=String(l.length));let f=0;if(l.forEach(c=>{f+=Number(c.total_value)||Number(c.book_qty)*Number(c.unit_price)||0}),m){let c=$t(f);m.innerHTML=`${c.val}<span class="kpi-unit">${c.unit}</span>`}a&&(a.textContent=String(l.length));let b=l.filter(c=>{if(r==="EXP"&&(c.days_remaining!==void 0?Number(c.days_remaining):999)>15&&!c.is_expired||i&&(c.nganh_hang||"").trim().toLowerCase()!==i||s&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==s)return!1;if(d){let y=(c.name||"").toLowerCase(),p=(c.code||"").toLowerCase();if(!y.includes(d)&&!p.includes(d))return!1}return!0});if(n&&(n.textContent=`Hi\u1EC3n th\u1ECB ${b.length} / ${l.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),ft(),!b.length){t&&(t.innerHTML=""),e&&(e.innerHTML=""),o&&o.classList.remove("hidden");return}o&&o.classList.add("hidden");let h=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=b.map((c,y)=>{let p=Number(c.book_qty)||0,x=Number(c.unit_price)||0,v=Number(c.total_value)||p*x,k=c.wasteQty||0,T=k*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(c.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${u(c.name||c.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${u(c.nganh_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${c.nhom_hang&&c.nhom_hang!==c.nganh_hang?`<span>\u2022</span><span>${u(c.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${u(c.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${p.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(v).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${p}" value="${k>0?k:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${u(c.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${u(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(E=>`<option value="${u(E)}" ${c.wasteReason===E?"selected":""}>${u(E)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${u(c.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${T>0?Math.round(T).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${u(c.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${u(c.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=b.map(c=>{let y=Number(c.book_qty)||0,p=Number(c.unit_price)||0,x=c.wasteQty||0,v=x*p;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(c.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${u(c.name||c.code)}</h4>
              <div class="text-xs text-gray-400">${u(c.nganh_hang||c.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${y.toFixed(1)} ${u(c.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(p).toLocaleString("vi-VN")} \u20AB / ${u(c.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${y.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${y}" value="${x>0?x:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${u(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${u(c.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${v>0?Math.round(v).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${u(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(k=>`<option value="${u(k)}" ${c.wasteReason===k?"selected":""}>${u(k)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function De(t,e){let o=(window.gFnbWasteStockItems||[]).find(d=>d.code===t);if(!o)return;let n=parseFloat(e),a=Number(o.book_qty)||0;isNaN(n)||n<0?o.wasteQty=0:n>a?(o.wasteQty=a,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${a})`)):o.wasteQty=n;let i=o.wasteQty*(Number(o.unit_price)||0),s=document.getElementById(`wasteLineTotal_${t}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let r=document.getElementById(`mobWasteLineTotal_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),ft()}function Re(t,e){let o=(window.gFnbWasteStockItems||[]).find(n=>n.code===t);o&&(o.wasteReason=e)}function Oe(t,e){let o=(window.gFnbWasteStockItems||[]).find(n=>n.code===t);o&&(o.wasteNote=e)}function ft(){let t=window.gFnbWasteStockItems||[],e=0,o=0;t.forEach(r=>{r.wasteQty>0&&(e++,o+=r.wasteQty*(Number(r.unit_price)||0))});let n=document.getElementById("kpiWasteSelectedCount");n&&(n.textContent=String(e));let a=document.getElementById("kpiWasteTotalEstAmount");if(a)if(o>0){let r=$t(o);a.innerHTML=`${r.val}<span class="kpi-unit">${r.unit}</span>`}else a.textContent="0 \u20AB";let i=document.getElementById("btnSubmitDirectWaste"),s=document.getElementById("btnSubmitDirectWasteText");i&&(i.disabled=e===0),s&&(s.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${e})`)}async function Ae(){let e=(window.gFnbWasteStockItems||[]).filter(d=>(d.wasteQty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=D(),n=new Date().toISOString().slice(0,10),a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",i=0;e.forEach(d=>{i+=d.wasteQty*(Number(d.unit_price)||0)});let s={site_code:o,waste_date:n,reason:e.length===1?e[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:a,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${e.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:a,lines:e.map(d=>({item_code:d.code,qty:d.wasteQty,unit_price:Number(d.unit_price)||0,reason_detail:d.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:d.wasteNote||""}))},r=document.getElementById("btnSubmitDirectWaste");r&&(r.disabled=!0,r.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let l=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!l.success)throw new Error(l.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${l.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${o} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),Z("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(d){console.error("submitDirectWaste error:",d),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+d.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),r&&(r.disabled=!1,r.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function Pe(){let t=document.getElementById("createWasteModal"),e=D(),o=document.getElementById("wasteModalSite"),n=document.getElementById("wasteModalDate");if(n&&!n.value&&(n.value=new Date().toISOString().slice(0,10)),o){let i="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(s=>{i+=`<option value="${s.code}" ${s.code===e?"selected":""}>${s.ten||s.name}</option>`}),o.innerHTML=i,o.value=e}await bt(e);let a=document.getElementById("wasteLinesContainer");a&&(a.innerHTML=""),ht(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function Wt(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function je(){let t=document.getElementById("wasteModalSite")?.value||"K001";await bt(t);let e=document.getElementById("wasteLinesContainer");e&&(e.innerHTML=""),ht()}async function bt(t){try{let o=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=o.success&&o.data?o.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function ht(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=window.gWasteModalInStockItems||[],o="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),n='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';e.forEach(i=>{n+=`<option value="${u(i.code)}" data-price="${i.unit_price}" data-unit="${u(i.unit||"")}" data-stock="${i.book_qty}">[${u(i.code)}] ${u(i.name)} (T\u1ED3n: ${Number(i.book_qty).toFixed(1)} ${u(i.unit||"")})</option>`});let a=`
    <div id="${o}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${o}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${n}
        </select>
        <button type="button" onclick="document.getElementById('${o}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${o}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
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
  `;t.insertAdjacentHTML("beforeend",a),window.lucide&&window.lucide.createIcons()}function We(t,e){let o=document.getElementById(t);if(!o)return;let n=e.options[e.selectedIndex],a=Number(n?.getAttribute("data-price"))||0,i=Number(n?.getAttribute("data-stock"))||0,s=o.querySelector(".waste-modal-price");s&&(s.textContent=Math.round(a).toLocaleString("vi-VN")+" \u20AB");let r=o.querySelector(".waste-modal-qty");r&&(r.max=String(i),r.placeholder=`T\u1ED1i \u0111a ${i.toFixed(1)}`),Vt(t,r?r.value:"0")}function Vt(t,e){let o=document.getElementById(t);if(!o)return;let n=o.querySelector("select"),a=n?.options[n.selectedIndex],i=Number(a?.getAttribute("data-price"))||0,r=(parseFloat(e)||0)*i,d=o.querySelector(".waste-modal-amt");d&&(d.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),qt()}function qt(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=0;t.querySelectorAll(".p-3").forEach(n=>{let a=n.querySelector("select"),i=a?.options[a.selectedIndex],s=Number(i?.getAttribute("data-price"))||0,r=n.querySelector(".waste-modal-qty"),d=parseFloat(r?.value||"0")||0;e+=d*s});let o=document.getElementById("wasteModalTotalAmount");o&&(o.textContent=e>0?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function Ve(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=[];if(t.querySelectorAll(".p-3").forEach(g=>{let m=g.querySelector("select"),f=m?.value,b=m?.options[m.selectedIndex],h=Number(b?.getAttribute("data-price"))||0,c=g.querySelector(".waste-modal-qty"),y=parseFloat(c?.value||"0")||0;f&&y>0&&e.push({item_code:f,qty:y,unit_price:h,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let o=document.getElementById("wasteModalSite")?.value||D(),n=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",i=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",s=document.getElementById("wasteModalNotes")?.value||"",r=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",d={site_code:o,waste_date:n,reason:a,confirmed_by:i,notes:s,created_by:r,lines:e},l=document.getElementById("btnSubmitWaste");l&&(l.disabled=!0,l.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let m=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})).json();if(!m.success)throw new Error(m.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${m.data.waste_code}!`),Wt(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),Z("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(g){console.error("submitCreateWaste error:",g),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+g.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),l&&(l.disabled=!1,l.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function Mn(){At();let t=D(),e=document.getElementById("fnbWasteFilterSite");e&&e.value!==t&&(e.value=t);let o=document.getElementById("fnbWasteSummary");o&&(o.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();a.success&&a.data?window.gFnbWasteStockItems=(a.data.items||[]).map(i=>({...i,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],jt(),tt(),Pt(t)}catch(n){console.error("loadFnbWaste error:",n),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+n.message)}}var L=window;L.gFnbWasteStockItems=L.gFnbWasteStockItems||[];L.gFnbWasteNganhMap=L.gFnbWasteNganhMap||null;L.gWasteModalInStockItems=L.gWasteModalInStockItems||[];L.getActiveFnbWasteSite=D;L.populateFnbWasteSiteDropdown=At;L.loadFnbWaste=Mn;L.switchFnbWasteSubView=Z;L.populateFnbWasteFilters=jt;L.populateFnbWasteNhomHangDropdown=mt;L.onFnbWasteNganhHangChange=Be;L.onFnbWasteFilterChange=Ne;L.onFnbWasteSearch=He;L.onFnbWasteSiteChange=Fe;L.renderFnbWasteStockTable=tt;L.onWasteLineQtyChange=De;L.onWasteLineReasonChange=Re;L.onWasteLineNoteChange=Oe;L.updateWasteKPIs=ft;L.submitDirectWaste=Ae;L.loadFnbWasteHistory=Pt;L.viewWasteDetail=_e;L.openCreateWasteModal=Pe;L.closeCreateWasteModal=Wt;L.onWasteModalSiteChange=je;L.loadWasteModalItems=bt;L.addWasteLineRow=ht;L.onWasteModalItemSelect=We;L.onWasteModalLineQtyInput=Vt;L.recalculateWasteModalTotal=qt;L.submitCreateWaste=Ve;function P(){let t=localStorage.getItem("orbit_user_site"),e=document.getElementById("globalBranchSelect")?.value,o=window,n=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbCountSiteSelect")?.value,i=t||e||n||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function yt(){let t=document.getElementById("fnbCountNganhHangFilter"),e=document.getElementById("fnbCountNhomHangFilter");if(!t||!e)return;let o=new Map;(window.gFnbAllItems||[]).forEach(i=>{let s=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(s)||o.set(s,new Set),o.get(s).add(r)}),window.gFnbNganhMap=o;let a='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(i=>{a+=`<option value="${u(i)}">${u(i)}</option>`}),t.innerHTML=a,t.value="",xt("")}function xt(t){let e=document.getElementById("fnbCountNhomHangFilter");if(!e)return;let o=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let n='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{n+=`<option value="${u(a)}">${u(a)}</option>`}),e.innerHTML=n,e.value=""}function qe(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";xt(t),R()}function Ue(){R()}function Ge(t){R()}function Qe(){R()}function Ke(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let e=document.getElementById("globalBranchSelect");e&&(e.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function Xe(t){window.gFnbBlindCount=t,R()}function Je(t,e){let o=(window.gCurrentCountItems||[]).find(n=>n.code===t);o&&(o.userCount=e===""?0:Number(e),R())}function ze(t,e){let o=(window.gCurrentCountItems||[]).find(n=>n.code===t);o&&(o.userNote=e)}function R(){let t=document.getElementById("fnbCountsTableBody"),e=document.getElementById("fnbCountsMobileCards"),o=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),n=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),a=document.getElementById("fnbCountStatusFilter")?.value||"all",i=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),s=window.gFnbAllItems||[],r=s.filter(c=>{if(o&&(c.nganh_hang||"").trim().toLowerCase()!==o||n&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==n)return!1;if(a!=="all"){let y=Number(c.book_qty)||0,x=(c.userCount!==void 0?Number(c.userCount):c.last_count_qty!==null&&c.last_count_qty!==void 0?Number(c.last_count_qty):y)-y,v=c.userCount!==void 0||c.last_count_qty!==null;if(a==="diff"&&Math.abs(x)<.001||a==="matched"&&Math.abs(x)>=.001||a==="counted"&&!v||a==="uncounted"&&v)return!1}if(i){let y=(c.name||"").toLowerCase(),p=(c.code||"").toLowerCase(),x=(c.nganh_hang||"").toLowerCase(),v=(c.nhom_hang||"").toLowerCase();if(!y.includes(i)&&!p.includes(i)&&!x.includes(i)&&!v.includes(i))return!1}return!0});window.gCurrentCountItems=r;let d=0,l=0,g=0;r.forEach(c=>{let y=Number(c.book_qty)||0,p=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,v=(Number(p)||0)-y,k=v*(Number(c.unit_price)||0);Math.abs(v)<.001?d++:l++,g+=k});let m=document.getElementById("fnbCountMetricTotal");m&&(m.textContent=String(r.length));let f=document.getElementById("fnbCountMetricMatched");f&&(f.textContent=String(d));let b=document.getElementById("fnbCountMetricDiff");b&&(b.textContent=String(l));let h=document.getElementById("fnbCountMetricDiffVal");h&&(h.textContent=(g>0?"+":"")+Math.round(g).toLocaleString("vi-VN")+" \u0111"),t&&(r.length===0?!s||s.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=r.map((c,y)=>{let p=Number(c.book_qty)||0,x=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:p,v=Number(x)||0,k=v-p,T=k*(Number(c.unit_price)||0),E='<span class="text-gray-400 tabular-nums">0</span>';k>0?E=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${k.toFixed(1)}</span>`:k<0&&(E=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${k.toFixed(1)}</span>`);let H='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';T>0?H=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(T).toLocaleString("vi-VN")} \u0111</span>`:T<0&&(H=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(T).toLocaleString("vi-VN")} \u0111</span>`);let dt=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${p<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${p.toFixed(1)}</span>`,J=c.nhom_hang||c.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${u(c.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${u(c.code)}</span>
                ${J?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${u(J)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${u(c.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${dt}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${v}" oninput="onCountInputChange('${u(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${E}</td>
            <td class="py-3 px-3 text-right select-all">${H}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${u(c.userNote||"")}" oninput="onCountNoteChange('${u(c.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),e&&(r.length===0?!s||s.length===0?e.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':e.innerHTML=r.map(c=>{let y=Number(c.book_qty)||0,p=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,x=Number(p)||0,v=x-y,k=v*(Number(c.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${u(c.nhom_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${u(c.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${u(c.code)}</span> \u2022 ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111/${u(c.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${y<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":y.toFixed(1)} ${u(c.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${u(c.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${v>0?"text-emerald-600":v<0?"text-rose-600":"text-gray-400"}">
                  ${v>0?"+":""}${v.toFixed(1)} (${(k>0?"+":"")+Math.round(k).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${u(c.userNote||"")}" oninput="onCountNoteChange('${u(c.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Ye(){let t=P(),e=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),o="DAILY",n=window.gCurrentCountItems||[];if(!n||!n.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let a=n.map(s=>{let r=Number(s.book_qty)||0,d=s.userCount!==void 0?Number(s.userCount):s.last_count_qty!==null&&s.last_count_qty!==void 0?Number(s.last_count_qty):r,l=d-r,g=l*(Number(s.unit_price)||0);return{item_code:s.code,item_name:s.name,item_group:s.item_group||s.nhom_hang||"NVL",unit:s.unit,unit_price:Number(s.unit_price)||0,book_qty:r,actual_qty:d,count_qty:d,diff_qty:l,diff_value:g,diff_val:g,note:s.userNote||""}}),i={site_code:t,count_date:e,count_type:o,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:a};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let r=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();if(!r.success)throw new Error(r.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${r.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(s){console.error("saveFnbCountAudit error:",s),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+s.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Ut(t){let e=t||P();try{let n=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(e)}`)).json(),a=document.getElementById("fnbCountsHistoryBody"),i=document.getElementById("fnbCountsHistoryMobileCards");if((a||i)&&n.success){let s=n.data.counts||[];s.length?(a&&(a.innerHTML=s.map(r=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${r.id})">${u(r.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${u(r.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${u(r.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${r.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${r.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${r.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${r.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${r.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${r.diff_value>0||r.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(r.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${u(r.notes||"\u2014")}</td>
            </tr>
          `).join("")),i&&(i.innerHTML=s.map(r=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${r.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${u(r.count_code)}</span>
                <span class="badge ${r.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${r.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${u(r.site_code)}</b></span>
                  <span class="num text-gray-500">${r.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${r.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(r.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${r.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(r.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(r.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(a&&(a.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${u(e)}.</td></tr>`),i&&(i.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${u(e)}.</div>`))}}catch(o){console.error("loadFnbCountsHistory error:",o)}}async function Ze(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let n=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),s&&(s.textContent=`${n.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let r=`
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
            ${n.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${u(l.item_name||l.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${l.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${l.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_qty<0?"text-rose-600":l.diff_qty>0?"text-emerald-600":"text-gray-400"}">${l.diff_qty>0?"+":""}${l.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_val<0?"text-rose-600":l.diff_val>0?"text-emerald-600":"text-gray-400"}">${l.diff_val>0?"+":""}${Math.round(l.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${u(l.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=r),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function tn(){document.getElementById("invDetailModal")?.classList.add("hidden")}function en(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let e=P(),o=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((d,l)=>{let g=Number(d.book_qty)||0,m=d.userCount!==void 0?Number(d.userCount):d.last_count_qty!==null&&d.last_count_qty!==void 0?Number(d.last_count_qty):g,f=m-g;a.push([l+1,d.code,d.name,d.nganh_hang||"",d.nhom_hang||d.item_group||"",d.unit,Number(d.unit_price)||0,g,m,f,d.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let i=XLSX.utils.aoa_to_sheet(a);i["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],i["!autofilter"]={ref:`A1:K${a.length}`},i["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let s=XLSX.utils.decode_range(i["!ref"]||"A1:K1");for(let d=s.s.r;d<=s.e.r;++d)for(let l=s.s.c;l<=s.e.c;++l){let g=XLSX.utils.encode_cell({r:d,c:l});if(i[g])if(d===0)i[g].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:l===0||l===1?"center":l>=6&&l<=9?"right":"left",wrapText:!1}};else{let m=l===0||l>=6&&l<=9,f=l===1||l===5;i[g].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:m?"right":f?"center":"left"}}}}let r=XLSX.utils.book_new();XLSX.utils.book_append_sheet(r,i,"PhieuKiemKe"),XLSX.writeFile(r,`Phieu_Kiem_Ke_${e}_${o}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function En(){let t=P(),e=document.getElementById("fnbCountSiteSelect");e&&e.value!==t&&(e.value=t);let n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(r=>r.code.toUpperCase()===t.toUpperCase()),a=n?n.ten||n.name:t,i=document.getElementById("fnbCountCurrentSiteBadge");i&&(i.textContent=a);let s=document.getElementById("fnbCountDatePicker");s&&!s.value&&(s.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let d=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();d.success&&d.data?(window.gFnbAllItems=d.data.items||[],yt(),R()):(window.gFnbAllItems=[],yt(),R()),Ut(t)}catch(r){console.error("loadFnbCounts error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var S=window;S.gFnbAllItems=S.gFnbAllItems||[];S.gCurrentCountItems=S.gCurrentCountItems||[];S.gFnbBlindCount=S.gFnbBlindCount||!1;S.gFnbNganhMap=S.gFnbNganhMap||null;S.getActiveFnbCountSite=P;S.loadFnbCounts=En;S.populateFnbCountFilters=yt;S.populateFnbCountNhomHangDropdown=xt;S.onFnbCountNganhHangChange=qe;S.onFnbCountFilterChange=Ue;S.onFnbCountSearch=Ge;S.onFnbCountDateChange=Qe;S.onFnbCountSiteChange=Ke;S.toggleBlindCount=Xe;S.onCountInputChange=Je;S.onCountNoteChange=ze;S.renderFnbCountsTable=R;S.saveFnbCountAudit=Ye;S.loadFnbCountsHistory=Ut;S.viewCountDetail=Ze;S.closeInvDetailModal=tn;S.exportCountSheetExcel=en;function wt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let e=t.sites||[],o=t.rows||[],n=t.groups||{},a=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];e.forEach(m=>{a.push(m.ten||m.name||m.code)});let i=[a];o.forEach((m,f)=>{let b=n[m.group]||m.group,h=[f+1,m.code,m.name,b,m.unit,m.price||0];e.forEach(c=>{let y=m.cells?m.cells[c.id]:void 0;h.push(y&&y.book||0)}),i.push(h)});let s=XLSX.utils.aoa_to_sheet(i),r=XLSX.utils.decode_range(s["!ref"]),d=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];e.forEach(()=>d.push({wch:16})),s["!cols"]=d;for(let m=r.s.r;m<=r.e.r;++m)for(let f=r.s.c;f<=r.e.c;++f){let b=XLSX.utils.encode_cell({r:m,c:f});if(!s[b])continue;if(m===0)s[b].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let c="left",y;f===0||f===1||f===4?c="center":(f===5||f>=6)&&(c="right",y="#,##0.00");let p=f>=6&&typeof s[b].v=="number"&&s[b].v<0;s[b].s={font:{name:"Aptos",sz:11,bold:p,color:{rgb:p?"C00000":"000000"}},alignment:{horizontal:c,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},y&&typeof s[b].v=="number"&&(s[b].z=y)}}s["!autofilter"]={ref:s["!ref"]},s["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let l=XLSX.utils.book_new();XLSX.utils.book_append_sheet(l,s,"T\u1ED3n Kho Chu\u1ED7i F&B");let g=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(l,`Ton_Kho_F&B_Chuoi_${g}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(e){console.error("Export Excel error:",e),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(e?.message||e))}}var O=null,$={site:"ALL",group:"ALL",search:"",showValue:!1},vt="";async function Gt(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);$.site&&$.site!=="ALL"&&$.site!=="all"&&t.searchParams.set("site_code",$.site),$.region&&$.region!=="ALL"&&t.searchParams.set("regionId",$.region),$.group&&$.group!=="ALL"&&t.searchParams.set("group",$.group),t.searchParams.set("refresh","true");let o=await(await fetch(t.toString())).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");O=o.data,window.gFnbStockData=O,rt()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function rt(){if(!O)return;let t=O.sites||[],e=O.rows||[],o=O.groups||{},n=(vt||"").trim().toLowerCase(),a=e.filter(p=>{if(!n)return!0;let x=(p.name||"").toLowerCase().includes(n),v=(p.code||"").toLowerCase().includes(n);return x||v}),i=$.site,s=a;i&&i!=="ALL"&&i!=="all"&&(s=a.filter(p=>{let x=p.cells&&p.cells[i];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let r=0,d=0,l=0;a.forEach(p=>{t.forEach(x=>{let v=p.cells&&p.cells[x.id];if(v){let k=Number(v.value)||0,T=Number(v.book)||0;r+=k,T<0&&d++,v.noOpening&&l++}})});let g=document.getElementById("fnbStockKpiTotalItems"),m=document.getElementById("fnbStockKpiTotalValue"),f=document.getElementById("fnbStockKpiNegative"),b=document.getElementById("fnbStockKpiNoOpening");g&&(g.textContent=s.length.toLocaleString("vi-VN")),m&&(m.textContent=Math.round(r).toLocaleString("vi-VN")+" \u0111"),f&&(f.textContent=d.toLocaleString("vi-VN")),b&&(b.textContent=l.toLocaleString("vi-VN"));let h=document.getElementById("fnbStockTableHead");if(h){let p=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(x=>{let v=x.region==="Mi\u1EC1n Nam";p+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${v?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${v?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),p+="</tr>",h.innerHTML=p}let c=document.getElementById("fnbStockTableBody");c&&(s.length===0?c.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:c.innerHTML=s.map((p,x)=>{let v=o[p.group]||p.group,k=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${v}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${p.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${p.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${p.price?Number(p.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${p.unit}</td>
        `;return t.forEach(T=>{let E=p.cells&&p.cells[T.id]||{book:0,lastCount:null,noOpening:!0,value:0},H=Number(E.book)||0,J=H<0?"text-rose-600 dark:text-rose-400 font-semibold":H>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",ot="";if(E.lastCount!==null&&E.lastCount!==void 0&&E.lastCount!==""){let lt=Number(E.lastCount);if(!isNaN(lt)){let se=Number.isInteger(lt)?lt.toLocaleString("vi-VN"):lt.toFixed(1);ot=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${E.lastDate||"N/A"}): ${se}">(${se})</span>`}}let K="";E.noOpening&&(K='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let It="",re=Number(E.value)||0;$.showValue&&re&&(It=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(re).toLocaleString("vi-VN")} \u0111</div>`);let Sn=Number.isInteger(H)?H.toLocaleString("vi-VN"):H.toFixed(1);k+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${K}
                <span class="${J}">${Sn}</span>${ot}
              </div>
              ${It}
            </td>
          `}),k+="</tr>",k}).join(""));let y=document.getElementById("fnbStockMobileCards");y&&(s.length===0?y.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':y.innerHTML=a.map(p=>{let x=o[p.group]||p.group,v=t.map(k=>{let T=p.cells&&p.cells[k.id]||{book:0,lastCount:null,noOpening:!0,value:0},E=Number(T.book)||0,H=E<0,dt=E===0,J=Number.isInteger(E)?E.toLocaleString("vi-VN"):E.toFixed(1),ot="";if(T.lastCount!==null&&T.lastCount!==void 0&&T.lastCount!==""){let K=Number(T.lastCount);isNaN(K)||(ot=`(${Number.isInteger(K)?K.toLocaleString("vi-VN"):K.toFixed(1)})`)}return{site:k,cell:T,isNeg:H,isZero:dt,bookFormatted:J,countText:ot}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${p.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${p.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${p.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${p.price?Number(p.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${v.map(k=>{let T=k.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${k.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":k.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${k.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${T?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${T?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${k.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":k.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${k.bookFormatted} <span class="text-xs text-gray-400 font-normal">${k.countText}</span></span>
                    </div>
                    ${k.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${$.showValue&&k.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(k.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function nn(){let t=document.getElementById("fnbStockFilterRegion"),e=document.getElementById("fnbStockFilterGroup"),o=document.getElementById("fnbStockFilterSite");o&&($.site=o.value),t&&($.region=t.value),e&&($.group=e.value),Gt()}function on(t){vt=t,rt()}function an(t){$.showValue=t,rt()}function na(){wt(O)}var A=window;A.gFnbStockData=O;A.gFnbStockFilter=$;A.gFnbStockSearchTerm=vt;A.loadFnbStock=Gt;A.renderFnbStock=rt;A.onFnbStockFilterChange=nn;A.onFnbStockSearch=on;A.onFnbStockToggleValue=an;A.exportFnbStockExcel=()=>wt(A.gFnbStockData||O);function Qt(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function Kt(t,e){return typeof window.cellBadge=="function"?window.cellBadge(t,e):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${e}</span>`}function Xt(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let e=document.createElement("div");return e.textContent=t||"",e.innerHTML}function I(t){return typeof window.fmtVND=="function"?window.fmtVND(t):ct(Number(t)||0)}function Jt(t){return typeof window.fmtNum=="function"?window.fmtNum(t):ut(Number(t)||0)}function j(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function kt(t){let e=window;e.App||(e.App={}),e.App.items=t}function st(){let t=document.getElementById("dinhMucBody"),e=document.getElementById("orderMobileCards"),o=(document.getElementById("orderSearch")?.value||"").toLowerCase(),n=document.getElementById("fLoai")?.value||"",a=document.getElementById("fChiNhap")?.checked,i=document.getElementById("orderSupplyChannel")?.value||"ALL",r=j().filter(l=>{if(o&&!l.maHang.toLowerCase().includes(o)&&!l.tenSP.toLowerCase().includes(o)||n&&l.tenLoai!==n||a&&(!l.soLuongDat||l.soLuongDat<=0))return!1;if(i==="BTT"){let g=((l.nguonCung||"")+" "+(l.tenLoai||"")+" "+(l.tenSP||"")).toLowerCase();if(!g.includes("btt")&&!g.includes("trung t\xE2m")&&!g.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(i==="NCC"){let g=((l.nguonCung||"")+" "+(l.tenLoai||"")).toLowerCase();if(g.includes("btt")||g.includes("trung t\xE2m"))return!1}else if(i==="URGENT"){let g=((l.nganh_hang||"")+" "+(l.tenLoai||"")+" "+(l.tenSP||"")).toLowerCase();if(!g.includes("t\u01B0\u01A1i")&&!g.includes("th\u1ECBt")&&!g.includes("rau")&&!g.includes("kh\u1EA9n"))return!1}return!0});if(!r.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),e&&(e.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let d=window.innerWidth>=1024;t&&(d?t.innerHTML=r.map(l=>{let g=l.soLuongDat||"",m=(l.soLuongDat||0)*(l.donGia||0);return`
          <tr>
            <td class="col-code">${Qt(l.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${l.tenSP}</span></td>
            <td>${Kt("neutral",l.tenLoai||"CCDC")}</td>
            <td>${l.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${I(l.donGia)}</span></td>
            <td class="col-num"><span class="num">${Jt(l.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${g}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${l.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${l.maHang}">${I(m)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),e&&(d?e.innerHTML="":e.innerHTML=r.map(l=>{let g=l.soLuongDat||"",m=(l.soLuongDat||0)*(l.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${Qt(l.maHang)}
                  ${Kt("neutral",l.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${l.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${l.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${I(l.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${Jt(l.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${g}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${l.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${l.maHang}">${I(m)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function rn(){st()}function sn(t,e){let n=j().find(a=>a.maHang===t);if(n){n.soLuongDat=Number(e)||0;let a=document.getElementById(`subtotal-${t}`);a&&(a.textContent=I(n.soLuongDat*(n.donGia||0)));let i=document.getElementById(`mob-subtotal-${t}`);i&&(i.textContent=I(n.soLuongDat*(n.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(s=>{s.value!==e&&(s.value=e)})}it()}function it(t,e){let o=document.getElementById("kpiNganSach"),n=document.getElementById("kpiDaDat"),a=t!==void 0?Number(t):Number(o?.dataset?.raw)||Number((o?.textContent||"").replace(/[^\d]/g,""))||0,i=e!==void 0?Number(e):Number(n?.dataset?.raw)||Number((n?.textContent||"").replace(/[^\d]/g,""))||0,r=j().reduce((v,k)=>v+(k.soLuongDat||0)*(k.donGia||0),0),d=i+r,l=a-d,g=a>0?Math.round(d/a*100):0,m=document.getElementById("kpiConLai");m&&(m.dataset.raw=String(l),m.textContent=I(l),m.title=I(l),l<0?(m.classList.remove("text-gray-900","dark:text-white"),m.classList.add("text-rose-600","dark:text-rose-400")):(m.classList.remove("text-rose-600","dark:text-rose-400"),m.classList.add("text-gray-900","dark:text-white")));let f=document.getElementById("kpiDangNhapSub");f&&(f.textContent="\u0110ang nh\u1EADp: "+I(r));let b=document.getElementById("kpiConLaiDelta");b&&(l<0?(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let h=document.getElementById("kpiTyLe");h&&(h.textContent=g+"%",g>100?h.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":g>80?h.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":h.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let c=document.getElementById("budUsed");c&&(c.textContent=I(d));let y=document.getElementById("budFill"),p=document.getElementById("budBadge"),x=document.getElementById("budNote");y&&(y.style.width=Math.min(g,100)+"%",g>100?(y.className="h-full rounded-full bg-rose-500 transition-all duration-300",p&&(p.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",p.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${g-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${g-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):g>80?(y.className="h-full rounded-full bg-amber-500 transition-all duration-300",p&&(p.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",p.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${g}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(y.className="h-full rounded-full bg-indigo-500 transition-all duration-300",p&&(p.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",p.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${g}%).`)))}async function zt(){let t=window,e=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",n=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(l=>(l.code||"").toLowerCase()===e.toLowerCase()),a=n?n.ten||n.name:document.getElementById("orderSite")?.value||e,i=document.getElementById("orderSite");if(i&&(i.innerHTML=`<option value="${a}">${a}</option>`,i.value=a),!a)return;let s=document.getElementById("globalMonthPicker")?.value,r=document.getElementById("orderMonth")?.value;if(!r||s&&r!==s){r=s||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let l=document.getElementById("orderMonth");l&&(l.value=r)}let d="";if(r){let l=r.split("-");d=`${l[1]}/${l[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let g=await(await fetch(`/api/quota?site=${encodeURIComponent(a)}&thang=${encodeURIComponent(d)}&refresh=true`)).json();if(g.success){kt(g.data.items||[]);let m=document.getElementById("kpiNganSach");m&&(m.dataset.raw=String(g.data.nganSach),m.textContent=I(g.data.nganSach),m.title=I(g.data.nganSach));let f=document.getElementById("kpiSubSite");f&&(f.textContent=g.data.site||a,f.title=g.data.site||a);let b=document.getElementById("kpiDaDat");b&&(b.dataset.raw=String(g.data.tienDaDat),b.textContent=I(g.data.tienDaDat),b.title=I(g.data.tienDaDat));let h=document.getElementById("budTotal");h&&(h.textContent=I(g.data.nganSach));let c=j(),y=Array.from(new Set(c.map(x=>x.tenLoai).filter(Boolean))),p=document.getElementById("fLoai");p&&(p.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+y.map(x=>`<option value="${x}">${x}</option>`).join("")),st(),it(g.data.nganSach,g.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(g.error||""))}catch(l){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(l?.message||l))}finally{typeof hideLoading=="function"&&hideLoading()}}function dn(){let e=j().filter(s=>(s.soLuongDat||0)>0);if(!e.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let o=document.getElementById("orderSite")?.value||"",n=document.getElementById("orderMonth")?.value||"",a=e.reduce((s,r)=>s+(r.soLuongDat||0)*(r.donGia||0),0),i=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${o}</b></div>
        <div>Th\xE1ng: <b>${n}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${I(a)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${e.map(s=>`
              <tr><td class="p-2 tabular-nums">${s.maHang}</td><td class="p-2">${s.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${s.soLuongDat}</td><td class="p-2 text-right tabular-nums">${I((s.soLuongDat||0)*s.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${e.map(s=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${Xt(s.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${Xt(s.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${s.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${I((s.soLuongDat||0)*s.donGia)}</div>
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
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",i)}async function ln(){let t=window,e=j(),o=e.filter(r=>(r.soLuongDat||0)>0),n=document.getElementById("orderSite")?.value||"",a=document.getElementById("orderMonth")?.value||"",i=document.getElementById("orderNote"),s=i?i.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let r={site:n,thang:a,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:s,items:o.map(g=>({maHang:g.maHang,tenSP:g.tenSP,dvt:g.dvt,donGia:g.donGia,soLuong:g.soLuongDat||0,daDat:g.daDat}))},l=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();l.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${l.data.maDon}`),e.forEach(g=>{g.soLuongDat=0}),zt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+l.error)}catch(r){typeof showToast=="function"&&showToast("L\u1ED7i: "+(r?.message||r))}finally{typeof hideLoading=="function"&&hideLoading()}}var W=window;W.loadQuota=zt;W.renderOrderTable=st;W.filterItems=rn;W.onQtyChange=sn;W.calcBudget=it;W.reviewOrder=dn;W.submitOrder=ln;W.getAppOrderItems=j;W.setAppOrderItems=kt;function Yt(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function cn(t){return typeof window.cellDate=="function"?window.cellDate(t):`<span class="tabular-nums text-xs text-gray-500">${V(t)}</span>`}function Zt(t){return typeof window.cellPerson=="function"?window.cellPerson(t):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${C(t||"\u2014")}</span>`}function te(t,e){return typeof window.cellBadge=="function"?window.cellBadge(t,e):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${e}</span>`}function C(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function B(t){return typeof window.fmtVND=="function"?window.fmtVND(t):ct(Number(t)||0)}function et(t){return typeof window.fmtNum=="function"?window.fmtNum(t):ut(Number(t)||0)}function V(t){return t?typeof window.fmtDate=="function"?window.fmtDate(t):ie(t):"\u2014"}function q(t){let e=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||e.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let n=o.permissions["portal-history"],a=o.permissions["portal-order"];if(n&&n.canEdit!==void 0)return!!n.canEdit;if(a&&a.canEdit!==void 0)return!!a.canEdit}if(o.role==="BEP_TRUONG"){if(!t)return!0;let n=(t.trangThai||t.status||"").toUpperCase();return n.includes("M\u1EDAI")||n.includes("CH\u1EDC")||n.includes("PENDING")||n===""}return!1}function U(t){let e=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||e.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let n=o.permissions["portal-history"],a=o.permissions["portal-order"];if(n&&n.canDelete!==void 0)return!!n.canDelete;if(a&&a.canDelete!==void 0)return!!a.canDelete}if(o.role==="BEP_TRUONG"){if(!t)return!0;let n=(t.trangThai||t.status||"").toUpperCase();return n.includes("M\u1EDAI")||n.includes("CH\u1EDC")||n.includes("PENDING")||n===""}return!1}function Lt(t){let e=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||e.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let n=o.permissions["portal-history"],a=o.permissions["portal-order"];if(n&&(n.canAuthenticate!==void 0||n.canVerify!==void 0||n.canEdit!==void 0))return!!(n.canAuthenticate||n.canVerify||n.canEdit);if(a&&(a.canAuthenticate!==void 0||a.canVerify!==void 0||a.canEdit!==void 0))return!!(a.canAuthenticate||a.canVerify||a.canEdit)}return!1}function Ct(t,e,o){let n=Number(t)||1,i=e||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[n]||`B\u01B0\u1EDBc ${n}`,s="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",r="bg-blue-500";return n>=7?(s="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",r="bg-emerald-500"):n>=4?(s="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",r="bg-indigo-500"):n>=2&&(s="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",r="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${o}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${r} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${n}/7:</span>
      <span class="truncate max-w-[100px] text-left">${C(i)}</span>
    </button>
  `}function St(t){let e=document.getElementById("hsBody"),o=document.getElementById("hsMobileCards");if(!t||!t.length){e&&(e.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}e&&(e.innerHTML=t.map(n=>{let a=q(n),i=U(n);return`
        <tr>
          <td class="col-code min-w-[130px]">${Yt(n.maDon)}</td>
          <td class="col-date min-w-[110px]">${cn(n.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${C(n.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${Zt(n.nguoiDat)}</td>
          <td class="col-num">${n.soDong}</td>
          <td class="col-num font-medium">${et(n.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${B(n.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${te("neutral",n.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${Ct(n.currentStep,n.currentStepName,n.maDon)}
          </td>
          <td class="col-actions min-w-[220px]">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="viewOrderDetail('${n.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs hover:border-slate-400 dark:hover:border-gray-600 transition" title="Xem chi ti\u1EBFt \u0111\u01A1n h\xE0ng">
                <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Xem</span>
              </button>
              <button onclick="openOrderJourneyModal('${n.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition" title="Theo d\xF5i & X\xE1c th\u1EF1c h\xE0nh tr\xECnh">
                <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                <span>H\xE0nh tr\xECnh</span>
              </button>
              ${a?`
                <button onclick="openEditOrderModal('${n.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${i?`
                <button onclick="confirmDeleteOrder('${n.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="X\xF3a \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(n=>{let a=q(n),i=U(n);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${Yt(n.maDon)}
            ${te("neutral",n.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${C(n.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${Ct(n.currentStep,n.currentStepName,n.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${V(n.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${Zt(n.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${n.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${et(n.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${B(n.tongTien)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewOrderDetail('${n.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Chi ti\u1EBFt</span>
            </button>
            <button onclick="openOrderJourneyModal('${n.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh</span>
            </button>
            ${a?`
              <button onclick="openEditOrderModal('${n.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${i?`
              <button onclick="confirmDeleteOrder('${n.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `}).join(""))}function ee(t){let e=window,o=e.App&&e.App.historyOrders?e.App.historyOrders:[];if(!t||t==="ALL"){St(o);return}let n=o.filter(a=>{let i=(a.trangThai||"").toUpperCase();return t==="APPROVED"?i.includes("DUY\u1EC6T")||i.includes("APPROVED"):t==="PENDING"?i.includes("CH\u1EDC")||i.includes("T\u1EA0O")||i.includes("PENDING"):t==="DELIVERED"?i.includes("NH\u1EACN")||i.includes("GIAO")||i.includes("DELIVERED"):t==="REJECTED"?i.includes("H\u1EE6Y")||i.includes("T\u1EEA CH\u1ED0I")||i.includes("REJECT"):!0});St(n)}async function un(){let t=window,e=document.getElementById("globalBranchSelect")?.value,o=t.gCurrentUser||(typeof t.loadPersistedUser=="function"?t.loadPersistedUser():null),n=o?o.assignedSite:"",a=localStorage.getItem("orbit_user_site"),i=document.getElementById("hsSite")?.value,s="";e?s=e==="ALL"?"":e:n?s=n==="ALL"?"":n:a?s=a==="ALL"?"":a:i&&(s=i==="ALL"?"":i);let r=document.getElementById("hsCurrentSiteBadge");if(r){if(s&&s!=="ALL"){let f=((typeof t.getAppSitesList=="function"?t.getAppSitesList():[])||[]).find(b=>b.code.toUpperCase()===s.toUpperCase()||b.name===s||b.ten&&b.ten===s);r.textContent=f?f.ten||f.name:s}else r.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";r.classList.remove("hidden")}let d=document.getElementById("hsSite");d&&(d.value=s);let l=document.getElementById("hsMonth")?.value||"",g="";if(l){let m=l.split("-");g=`${m[1]}/${m[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let m=`/api/orders?site=${encodeURIComponent(s)}&thang=${encodeURIComponent(g)}&_t=${Date.now()}`,b=await(await fetch(m,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();t.App||(t.App={}),t.App.historyOrders=b.success&&b.data?b.data:[];let h=document.getElementById("hsOrderStatusFilter")?.value||"ALL";ee(h)}catch(m){console.error("loadHistory error:",m)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function gn(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}`)).json();if(o.success){let{info:n,items:a,timeline:i}=o.data,s=`
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <div class="tabular-nums font-bold">${n.order_code}</div>
              <div class="text-gray-500 dark:text-gray-400">${n.site_name} \xB7 ${n.ordered_by}</div>
            </div>
            <button onclick="if(typeof exportSingleOrderExcel==='function')exportSingleOrderExcel('${n.order_code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
              Xu\u1EA5t Excel
            </button>
          </div>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto max-h-48 rounded-xl border border-gray-200 dark:border-gray-800">
            <table class="data-table">
              <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2">\u0110VT</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">\u0110\u01A1n gi\xE1</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
              <tbody>
                ${(a||[]).map(r=>`<tr><td class="p-2 tabular-nums">${r.maHang}</td><td class="p-2">${r.tenSP}</td><td class="p-2">${r.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${r.soLuong}</td><td class="p-2 text-right tabular-nums">${B(r.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${B(r.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(a||[]).map(r=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${C(r.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${C(r.maHang)} \xB7 <span class="font-sans">${C(r.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${r.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${B(r.thanhTien)}</div>
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
              <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${n.order_code}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
                <span>Xem & X\xE1c th\u1EF1c chi ti\u1EBFt</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800/80 pl-3">
              ${(i||[]).map(r=>`
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>B\u01B0\u1EDBc ${r.buoc}: ${r.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${r.thoiGian?V(r.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${r.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${r.trangThai}</span>${r.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${C(r.ghiChu)}"</span>`:""}</div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${n.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh \u0111\u01A1n</span>
            </button>
            <div class="flex items-center gap-2">
              ${q(n)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${n.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${U(n)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${n.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${t}`,s)}}catch(e){typeof showToast=="function"&&showToast("L\u1ED7i: "+(e?.message||e))}finally{typeof hideLoading=="function"&&hideLoading()}}var pn=null,mn=null,Mt=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function Et(t,e){let o=document.getElementById("journeyTimelineContainer");if(!o)return;let n=document.getElementById("journeyCurrentStepText"),a={};(e||[]).forEach(r=>{let d=Number(r.buoc);d&&(a[d]=r)});let i=Object.keys(a).map(Number),s=i.length?Math.max(...i):1;n&&(n.textContent=`B\u01B0\u1EDBc ${s}/7 (${Mt[s-1]?.name||""})`),o.innerHTML=Mt.map(r=>{let d=a[r.step],l=d&&(d.trangThai==="Ho\xE0n th\xE0nh"||d.trangThai==="Ho\xE0n t\u1EA5t"),g=r.step===s||d&&!l,m="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",f=`<span class="font-mono text-xs font-bold">${r.step}</span>`,b="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",h="text-gray-500 dark:text-gray-400 font-medium",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return l?(m="bg-emerald-600 text-white border-emerald-600 shadow-sm",f='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',b="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",h="text-emerald-900 dark:text-emerald-200 font-bold",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):g&&(m="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",f='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',b="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",h="text-indigo-900 dark:text-indigo-100 font-bold",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${m}">
          ${f}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${b} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${h}">B\u01B0\u1EDBc ${r.step}: ${C(d?.tenBuoc||r.name)}</span>
            ${c}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${C(r.desc)}</p>
          ${d?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${C(d.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${d.thoiGian?V(d.thoiGian):""}
              </div>
              ${d.ghiChu?`
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${C(d.ghiChu)} "
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}).join("")}async function fn(t){if(!t)return;pn=t,window._currentJourneyOrderCode=t;let e=document.getElementById("modalOrderJourney");if(!e)return;let o=document.getElementById("journeyOrderSubtitle");o&&(o.textContent=`M\xE3 \u0111\u01A1n: ${t}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!a.success||!a.data){typeof showToast=="function"&&showToast(a.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:i,timeline:s}=a.data;mn=a.data,window._currentJourneyData=a.data;let r=document.getElementById("journeySiteName");r&&(r.textContent=i.site_name||i.site||"\u2014");let d=document.getElementById("journeyOrderedBy");d&&(d.textContent=i.ordered_by||"\u2014");let l=document.getElementById("journeyOrderDate");l&&(l.textContent=V(i.order_date||""));let g=document.getElementById("journeyBadgeStatus");g&&(g.textContent=i.status||"\u0110ang x\u1EED l\xFD"),Et(i,s||[]);let m=Lt(i),f=document.getElementById("journeyAdminSection");if(f)if(m){f.classList.remove("hidden");let b=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,h=document.getElementById("journeyAdminActor");h&&(h.textContent=b&&(b.fullName||b.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let c=s&&s.length?Math.max(...s.map(v=>Number(v.buoc)||1)):1,y=Math.min(c+1,7),p=document.getElementById("journeySelectStep");p&&(p.value=String(y));let x=document.getElementById("journeyStepNote");x&&(x.value="")}else f.classList.add("hidden");e.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(n){console.error("Error openOrderJourneyModal:",n),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function bn(){let t=document.getElementById("modalOrderJourney");t&&t.classList.add("hidden")}async function hn(){let t=pn||window._currentJourneyOrderCode;if(!t)return;let e=document.getElementById("journeySelectStep"),o=document.getElementById("journeyStepStatus"),n=document.getElementById("journeyStepNote"),a=document.getElementById("btnSubmitJourneyStep"),i=Number(e?e.value:1),s=o?o.value:"Ho\xE0n th\xE0nh",r=n?n.value.trim():"",d=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,l=d&&(d.fullName||d.email)||"Admin",m={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[i]||`B\u01B0\u1EDBc ${i}`;try{a&&(a.disabled=!0,a.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let b=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,step:i,stepName:m,status:s,note:r,actor:l})})).json();if(!b.success){typeof showToast=="function"&&showToast(b.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${i}: ${m}`,"success"),b.data&&b.data.timeline){let h=mn?.info||window._currentJourneyData?.info||{order_code:t};h.status=b.data.orderStatus;let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=h.status),Et(h,b.data.timeline),e&&i<7&&(e.value=String(i+1)),n&&(n.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(f){console.error("Error submitJourneyStep:",f),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{a&&(a.disabled=!1,a.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var _=[],ne=null;async function yn(t){if(!q()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:n,items:a}=o.data,i=document.getElementById("editOrderCode");i&&(i.value=n.order_code||t);let s=document.getElementById("editOrderSubtitle");s&&(s.textContent=`M\xE3 \u0111\u01A1n: ${n.order_code||t}`);let r=document.getElementById("editOrderSite");if(r){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];r.innerHTML=c.map(y=>{let p=y.ten||y.name||y.code||y,x=n.site_name===p||n.site_name===y.name||n.site_name===y.code?"selected":"";return`<option value="${p}" ${x}>${p}</option>`}).join(""),n.site_name&&!c.some(y=>(y.ten||y.name||y.code)===n.site_name)&&r.insertAdjacentHTML("afterbegin",`<option value="${n.site_name}" selected>${n.site_name}</option>`)}let d=document.getElementById("editOrderDate");d&&(d.value=(n.order_date||"").slice(0,10));let l=document.getElementById("editOrderStatus");l&&(l.value=n.status||"M\u1EDBi t\u1EA1o");let g=document.getElementById("editOrderNguoiDat");g&&(g.value=n.ordered_by||"");let m=document.getElementById("editOrderThang");m&&(m.value=n.applied_month||"");let f=document.getElementById("editOrderGhiChu");f&&(f.value=""),_=(a||[]).map(c=>({maHang:c.maHang||c.item_code,tenSP:c.tenSP||c.item_name,dvt:c.dvt||c.unit||"Ph\u1EA7n",soLuong:Number(c.soLuong??c.order_qty??1),donGia:Number(c.donGia??c.unit_price??0),thanhTien:Number(c.thanhTien??(c.soLuong||1)*(c.donGia||0)),ghiChu:c.ghiChu||""})),window._editOrderItems=_;let b=document.getElementById("editOrderAddSelect");if(b){let c=window,y=c.App&&c.App.items&&c.App.items.length?c.App.items:[];if(!y.length)try{let x=await(await fetch(`/api/quota?site=${encodeURIComponent(n.site_name||"K001")}&thang=${encodeURIComponent(n.applied_month||"")}`)).json();x.success&&x.data?.items&&(y=x.data.items,c.App&&(c.App.items=y))}catch{}b.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+y.map(p=>`
          <option value="${C(p.maHang||p.code)}" 
                  data-name="${C(p.tenHang||p.tenSP||p.name||"")}" 
                  data-unit="${C(p.dvt||p.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(p.donGia||p.price||0)}">
            [${C(p.maHang||p.code)}] ${C(p.tenHang||p.tenSP||p.name||"")} (${B(p.donGia||p.price||0)}/${p.dvt||p.unit||""})
          </option>
        `).join("")}nt();let h=document.getElementById("modalEditOrder");h&&h.classList.remove("hidden")}catch(e){console.error("openEditOrderModal error:",e),typeof showToast=="function"&&showToast("L\u1ED7i: "+(e?.message||e),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function oe(){let t=document.getElementById("modalEditOrder");t&&t.classList.add("hidden"),_=[],window._editOrderItems=[]}function nt(){let t=document.getElementById("editOrderItemsBody"),e=document.getElementById("editOrderItemsMobile"),o=_;t&&(o.length?t.innerHTML=o.map((n,a)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${a+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${C(n.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${C(n.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${C(n.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${n.soLuong}" 
                   onchange="updateEditOrderItemQty(${a}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${B(n.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${B(n.soLuong*n.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${a})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="X\xF3a d\xF2ng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join(""):t.innerHTML='<tr><td colspan="8" class="p-4 text-center text-gray-400">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o. Vui l\xF2ng th\xEAm m\u1EB7t h\xE0ng b\xEAn d\u01B0\u1EDBi.</td></tr>'),e&&(o.length?e.innerHTML=o.map((n,a)=>`
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${C(n.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${C(n.maHang)} \xB7 <span class="font-sans">${C(n.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${a})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">S\u1ED1 l\u01B0\u1EE3ng:</span>
              <input type="number" min="0.1" step="0.5" value="${n.soLuong}" 
                     onchange="updateEditOrderItemQty(${a}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${B(n.soLuong*n.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):e.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),ae()}function xn(t,e){let o=Math.max(0,Number(e)||0);_&&_[t]&&(_[t].soLuong=o,_[t].thanhTien=o*(_[t].donGia||0),nt())}function wn(t){_&&_.length>t&&(_.splice(t,1),nt())}function vn(){let t=document.getElementById("editOrderAddSelect"),e=document.getElementById("editOrderAddQty");if(!t||!t.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let o=t.value,n=t.selectedOptions[0],a=n.getAttribute("data-name")||o,i=n.getAttribute("data-unit")||"Ph\u1EA7n",s=Number(n.getAttribute("data-price"))||0,r=Math.max(.1,Number(e?e.value:1)||1),d=_.find(l=>l.maHang===o);d?(d.soLuong+=r,d.thanhTien=d.soLuong*d.donGia):_.push({maHang:o,tenSP:a,dvt:i,soLuong:r,donGia:s,thanhTien:r*s,ghiChu:""}),t.value="",e&&(e.value="1"),nt()}function ae(){let t=_,e=0,o=0;t.forEach(s=>{e+=Number(s.soLuong)||0,o+=(Number(s.soLuong)||0)*(Number(s.donGia)||0)});let n=document.getElementById("editOrderItemsCount");n&&(n.textContent=String(t.length));let a=document.getElementById("editOrderTotalQty");a&&(a.textContent=et(e));let i=document.getElementById("editOrderTotalAmount");i&&(i.textContent=B(o))}async function kn(){if(!q()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let t=document.getElementById("editOrderCode")?.value;if(!t){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let e=document.getElementById("editOrderSite")?.value,o=document.getElementById("editOrderDate")?.value,n=document.getElementById("editOrderStatus")?.value,a=document.getElementById("editOrderNguoiDat")?.value,i=document.getElementById("editOrderThang")?.value,s=document.getElementById("editOrderGhiChu")?.value,r=_.filter(l=>(Number(l.soLuong)||0)>0);if(!r.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let d=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let g=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,site:e,orderDate:o,status:n,orderedBy:a,month:i,ghiChu:s,actor:d?d.full_name||d.fullName||d.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:r})})).json();if(!g.success)throw new Error(g.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),oe(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(l){console.error("saveEditOrder error:",l),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(l?.message||l),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function Ln(t){if(!U()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}ne=t,window._pendingDeleteOrderCode=t;let e=document.getElementById("confirmDeleteOrderCode");e&&(e.textContent=t);let o=document.getElementById("confirmDeleteOrderInfo");o&&(o.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let n=document.getElementById("modalConfirmDeleteOrder");n&&n.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let i=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(i.success&&i.data&&o){let{info:s,items:r}=i.data,d=(r||[]).reduce((g,m)=>g+(Number(m.thanhTien)||0),0),l=(r||[]).reduce((g,m)=>g+(Number(m.soLuong)||0),0);o.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${C(s.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${V(s.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${C(s.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${C(s.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${r.length} m\xF3n (${et(l)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${B(d)}</span>
          </div>
        </div>
      `}}catch{}}function Tt(){let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.add("hidden"),ne=null,window._pendingDeleteOrderCode=null}async function Cn(){let t=ne||window._pendingDeleteOrderCode;if(t){if(!U()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),Tt();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let o=await(await fetch(`/api/order?orderCode=${encodeURIComponent(t)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t})})).json();if(!o.success)throw new Error(o.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Tt(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(e){console.error("executeDeleteOrder error:",e),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(e?.message||e),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var M=window;M.renderJourneyBadge=Ct;M.renderHsOrdersList=St;M.filterHsOrders=ee;M.loadHistory=un;M.viewOrderDetail=gn;M.canEditOrders=q;M.canDeleteOrders=U;M.canAuthenticateJourney=Lt;M.STANDARD_STEPS=Mt;M.renderJourneyTimeline=Et;M.openOrderJourneyModal=fn;M.closeOrderJourneyModal=bn;M.submitJourneyStep=hn;M.openEditOrderModal=yn;M.closeEditOrderModal=oe;M.renderEditOrderItems=nt;M.updateEditOrderItemQty=xn;M.removeEditOrderItemLine=wn;M.addEditOrderItemLine=vn;M.recalcEditOrderTotals=ae;M.saveEditOrder=kn;M.confirmDeleteOrder=Ln;M.closeDeleteOrderModal=Tt;M.executeDeleteOrder=Cn;console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{Mt as STANDARD_STEPS,vn as addEditOrderItemLine,ke as addManualReceiptItem,ht as addWasteLineRow,Rn as api,it as calcBudget,Lt as canAuthenticateJourney,U as canDeleteOrders,q as canEditOrders,Ot as closeConfirmClearManualLinesModal,Ht as closeCreateReceiptModal,Wt as closeCreateWasteModal,Tt as closeDeleteOrderModal,oe as closeEditOrderModal,tn as closeInvDetailModal,Ft as closeManualReceiptModal,bn as closeOrderJourneyModal,Rt as confirmClearAllManualReceiptLines,Ln as confirmDeleteOrder,mn as currentJourneyData,pn as currentJourneyOrderCode,Fn as debounce,_ as editOrderItems,u as escapeHtml,Ie as executeClearAllManualReceiptLines,Cn as executeDeleteOrder,en as exportCountSheetExcel,wt as exportFnbStockExcel,ee as filterHsOrders,rn as filterItems,X as filterManualCatalogList,$t as formatCompactVND,ie as formatDate,Hn as formatDateYMD,ut as formatNumber,G as formatReceiptDateYMD,ct as formatVND,O as gFnbStockData,$ as gFnbStockFilter,vt as gFnbStockSearchTerm,P as getActiveFnbCountSite,F as getActiveFnbReceiptSite,D as getActiveFnbWasteSite,j as getAppItems,N as getReceiptExpWarningHtml,na as handleExportFnbStockExcel,En as loadFnbCounts,Ut as loadFnbCountsHistory,Q as loadFnbPoList,de as loadFnbReceipts,he as loadFnbReceiptsHistory,Gt as loadFnbStock,Mn as loadFnbWaste,Pt as loadFnbWasteHistory,un as loadHistory,at as loadManualCatalogItems,zt as loadQuota,bt as loadWasteModalItems,Je as onCountInputChange,ze as onCountNoteChange,Qe as onFnbCountDateChange,Ue as onFnbCountFilterChange,qe as onFnbCountNganhHangChange,Ge as onFnbCountSearch,Ke as onFnbCountSiteChange,le as onFnbPoSearchInput,nn as onFnbStockFilterChange,on as onFnbStockSearch,an as onFnbStockToggleValue,Ne as onFnbWasteFilterChange,Be as onFnbWasteNganhHangChange,He as onFnbWasteSearch,Fe as onFnbWasteSiteChange,Se as onManualLineBatchChange,Me as onManualLineExpChange,Te as onManualLineLocChange,Ce as onManualLinePriceChange,Le as onManualLineQtyChange,we as onManualReceiptSiteChange,sn as onQtyChange,ue as onReceiptLineBatchChange,ge as onReceiptLineExpChange,me as onReceiptLineNoteChange,ce as onReceiptLineQtyChange,Oe as onWasteLineNoteChange,De as onWasteLineQtyChange,Re as onWasteLineReasonChange,We as onWasteModalItemSelect,Vt as onWasteModalLineQtyInput,je as onWasteModalSiteChange,fe as openCreateReceiptModal,Pe as openCreateWasteModal,yn as openEditOrderModal,xe as openManualReceiptModal,fn as openOrderJourneyModal,Bt as openPoReceiptModal,ne as pendingDeleteOrderCode,yt as populateFnbCountFilters,xt as populateFnbCountNhomHangDropdown,jt as populateFnbWasteFilters,mt as populateFnbWasteNhomHangDropdown,At as populateFnbWasteSiteDropdown,ae as recalcEditOrderTotals,qt as recalculateWasteModalTotal,wn as removeEditOrderItemLine,Dt as removeManualReceiptLine,nt as renderEditOrderItems,R as renderFnbCountsTable,gt as renderFnbPoTable,rt as renderFnbStock,tt as renderFnbWasteStockTable,St as renderHsOrdersList,Ct as renderJourneyBadge,Et as renderJourneyTimeline,Y as renderManualReceiptLinesTable,st as renderOrderTable,Nt as renderReceiptLinesTable,dn as reviewOrder,kn as saveEditOrder,Ye as saveFnbCountAudit,kt as setAppItems,Ee as setManualLineQuickExp,pe as setReceiptLineQuickExp,be as submitCreateReceipt,Ve as submitCreateWaste,Ae as submitDirectWaste,hn as submitJourneyStep,$e as submitManualReceipt,ln as submitOrder,z as switchFnbReceiptSubView,Z as switchFnbWasteSubView,Xe as toggleBlindCount,ve as toggleManualShowAllCatalog,xn as updateEditOrderItemQty,pt as updateManualTotals,ft as updateWasteKPIs,Ze as viewCountDetail,gn as viewOrderDetail,ye as viewReceiptDetail,_e as viewWasteDetail};
