export function TavernScene(){return <svg className="tavern-scene" viewBox="0 0 720 640" fill="none" aria-hidden="true">
 <defs>
  <linearGradient id="room" x2="0" y2="640" gradientUnits="userSpaceOnUse"><stop stopColor="#1c1520"/><stop offset="1" stopColor="#543026"/></linearGradient>
  <radialGradient id="glow"><stop stopColor="#ffc16a" stopOpacity=".65"/><stop offset="1" stopColor="#ff952e" stopOpacity="0"/></radialGradient>
  <linearGradient id="night" x2="0" y2="1"><stop stopColor="#273748"/><stop offset="1" stopColor="#79827c"/></linearGradient>
  <linearGradient id="wood" x2="0" y2="1"><stop stopColor="#9b643b"/><stop offset=".12" stopColor="#6a402b"/><stop offset="1" stopColor="#301f1c"/></linearGradient>
  <linearGradient id="fire" x2="0" y2="1"><stop stopColor="#ffe8a2"/><stop offset=".5" stopColor="#ec9b3e"/><stop offset="1" stopColor="#a64425"/></linearGradient>
  <pattern id="stone" width="110" height="65" patternUnits="userSpaceOnUse"><path d="M0 0H110V65H0ZM55 0V32M0 32H110" stroke="#c69967" strokeOpacity=".12" strokeWidth="3"/></pattern>
  <filter id="soft"><feGaussianBlur stdDeviation="5"/></filter>
 </defs>
 <path d="M25 610V200C25 92 150 25 360 25S695 92 695 200V610Z" fill="url(#room)"/>
 <path d="M25 610V200C25 92 150 25 360 25S695 92 695 200V610" stroke="#b38b57" strokeOpacity=".45" strokeWidth="3"/>
 <path d="M45 610V205C45 105 165 46 360 46S675 105 675 205V610" stroke="#67432c" strokeWidth="16"/>
 <path d="M70 242H650M70 402H650" stroke="#221819" strokeWidth="22"/><path d="M82 247H638M82 407H638" stroke="#91603a" strokeOpacity=".4" strokeWidth="3"/>
 <path d="M90 510V250Q90 100 220 100Q350 100 350 250V510Z" fill="#191a21" stroke="#916747" strokeWidth="13"/>
 <path d="M108 500V250Q108 120 220 120Q332 120 332 250V500Z" fill="url(#night)"/>
 <circle cx="265" cy="192" r="30" fill="#e8dabb"/><circle cx="277" cy="182" r="28" fill="#394655"/>
 <path d="M108 370L157 280L190 336L239 253L285 345L332 305V500H108Z" fill="#344546"/>
 <path d="M108 420L143 372L180 390L225 335L281 398L332 363V500H108Z" fill="#253a38"/>
 {[130,183,287,314].map((x,i)=><path key={x} d={`M${x} ${410-i*8}l-23 42h14l-22 29h65l-22-29h12Z`} fill="#162e2b"/>)}
 <path d="M220 120V500M108 300H332M108 404H332" stroke="#49352c" strokeWidth="12"/>
 <path d="M211 125V500M110 294H330" stroke="#be9361" strokeOpacity=".4" strokeWidth="2"/>
 <path d="M385 110H592L615 491H368Z" fill="#4b3d36"/><path d="M385 110H592L615 491H368Z" fill="url(#stone)"/>
 <path d="M402 492V366Q402 281 493 281Q584 281 584 366V492Z" fill="#20191b" stroke="#85634a" strokeWidth="18"/>
 <ellipse cx="493" cy="424" rx="184" ry="160" fill="url(#glow)" className="hearth-glow"/>
 <path d="M435 465Q407 432 453 382Q449 416 471 426Q460 362 501 337Q489 393 521 405Q536 390 531 369Q590 443 548 465Z" fill="url(#fire)" className="hearth-flame"/>
 <path d="M471 468Q453 435 486 408Q483 440 504 445Q505 422 520 413Q541 453 521 470Z" fill="#ffe0a0"/>
 <path d="M433 474L551 452M438 452L552 476" stroke="#4b2720" strokeWidth="14"/>
 <path d="M374 270H608V288H374Z" fill="url(#wood)" stroke="#ad8050" strokeWidth="2"/>
 <path d="M425 260V217H454V260Z" fill="#624e35"/><path d="M432 217V199H446V217" fill="#887a46"/>
 <path d="M542 260V224H567V260Z" fill="#3d6057"/><path d="M549 224V205H560V224" fill="#608279"/>
 <path d="M474 253V232H509V253" stroke="#9d7953" strokeWidth="5"/><circle cx="491" cy="210" r="26" fill="#392c28" stroke="#aa8355" strokeWidth="3"/><path d="M482 211L489 219L503 201" stroke="#bda274" strokeWidth="3"/>
 <path d="M80 523L612 499L688 566L116 608Z" fill="url(#wood)" stroke="#98603a" strokeWidth="3"/><path d="M116 608V638L688 594V566" fill="#2c1d1b"/>
 <path d="M139 553L561 532M181 579L599 552" stroke="#c6985d" strokeOpacity=".18" strokeWidth="2"/>
 <path d="M317 541L391 522L457 554L379 578Z" fill="#d5b482" stroke="#826044" strokeWidth="3"/><path d="M391 523L379 578M329 543L374 531M337 551L371 541M397 536L432 553M393 546L422 561" stroke="#866348" strokeWidth="2"/>
 <path d="M530 501L535 543Q554 553 573 540L577 497" fill="#855331" stroke="#ba8d52" strokeWidth="3"/><ellipse cx="554" cy="498" rx="23" ry="7" fill="#e3c898"/><path d="M577 505Q605 501 600 524Q597 536 575 532" stroke="#bd945a" strokeWidth="7"/>
 <ellipse cx="191" cy="537" rx="31" ry="7" fill="#b59050"/><path d="M188 535V486H199V535Z" fill="#d4af6f"/><path d="M193 488Q179 476 194 458Q207 479 193 488" fill="#ffe0a0" className="hearth-flame"/><ellipse cx="193" cy="477" rx="70" ry="80" fill="url(#glow)"/>
 <path d="M360 47V115M344 114H377L386 167H334Z" stroke="#b18a50" strokeWidth="4" fill="#342523"/><path d="M344 125H376L380 158H339Z" fill="#edbb67"/><circle cx="360" cy="145" r="70" fill="url(#glow)"/>
 {[ [148,172],[306,224],[460,320],[560,373],[350,403],[614,215] ].map(([x,y],i)=><circle className="tavern-mote" key={i} cx={x} cy={y} r="1.8" fill="#f6d49b" style={{animationDelay:`${i*.6}s`}}/>)}
</svg>}
