/* Ported 1:1 from canvas board Home-A (HomeDefs). Keep structure; replace data only. */
export function HomeDefs() {
  return (
    <>
<svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
<defs>
{/* 勾花网：菱形网孔 */}
<pattern id="pChain" width="34" height="34" patternUnits="userSpaceOnUse">
<path d="M0 17L17 0L34 17L17 34Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
</pattern>
<pattern id="pChainL" width="54" height="54" patternUnits="userSpaceOnUse">
<path d="M0 27L27 0L54 27L27 54Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
</pattern>
{/* 焊接网：正交 + 焊点（红点即 logo 的点） */}
<pattern id="pWeld" width="36" height="36" patternUnits="userSpaceOnUse">
<path d="M0 0H36M0 0V36" stroke="currentColor" strokeWidth="1.4" fill="none" />
<circle cx="0" cy="0" r="2.8" fill="var(--red)" /><circle cx="36" cy="0" r="2.8" fill="var(--red)" />
<circle cx="0" cy="36" r="2.8" fill="var(--red)" /><circle cx="36" cy="36" r="2.8" fill="var(--red)" />
</pattern>
<pattern id="pWeldQ" width="30" height="30" patternUnits="userSpaceOnUse">
<path d="M0 0H30M0 0V30" stroke="currentColor" strokeWidth="1.2" fill="none" />
<circle cx="0" cy="0" r="2.2" fill="currentColor" />
</pattern>
{/* 编织网：上下起伏的波纹丝 */}
<pattern id="pWoven" width="36" height="36" patternUnits="userSpaceOnUse">
<path d="M0 9Q9 1 18 9T36 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
<path d="M0 27Q9 19 18 27T36 27" fill="none" stroke="currentColor" strokeWidth="1.6" />
<path d="M9 0Q1 9 9 18T9 36" fill="none" stroke="currentColor" strokeWidth="1.6" />
<path d="M27 0Q19 9 27 18T27 36" fill="none" stroke="currentColor" strokeWidth="1.6" />
</pattern>
{/* 钢格板：扁钢承重条 + 细扭绞横杆 */}
<pattern id="pGrate" width="22" height="22" patternUnits="userSpaceOnUse">
<path d="M3 0V22" stroke="currentColor" strokeWidth="4.5" />
<path d="M14 0V22" stroke="currentColor" strokeWidth="4.5" />
<path d="M0 11H22" stroke="currentColor" strokeWidth="1.2" />
</pattern>
{/* 冲孔网：错排圆孔 */}
<pattern id="pPerf" width="24" height="24" patternUnits="userSpaceOnUse">
<circle cx="6" cy="6" r="3.6" fill="currentColor" />
<circle cx="18" cy="18" r="3.6" fill="currentColor" />
</pattern>
{/* 拉伸网：菱形孔错排 */}
<pattern id="pExp" width="32" height="18" patternUnits="userSpaceOnUse">
<path d="M0 9L8 0H24L32 9L24 18H8Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
</pattern>
{/* 线径渐变分隔带用：由疏到密 */}
<pattern id="pG1" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M0 0H30M0 0V30" stroke="currentColor" strokeWidth="2.6" fill="none" /></pattern>
<pattern id="pG2" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 0H22M0 0V22" stroke="currentColor" strokeWidth="2" fill="none" /></pattern>
<pattern id="pG3" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 0H16M0 0V16" stroke="currentColor" strokeWidth="1.5" fill="none" /></pattern>
<pattern id="pG4" width="11" height="11" patternUnits="userSpaceOnUse"><path d="M0 0H11M0 0V11" stroke="currentColor" strokeWidth="1.1" fill="none" /></pattern>
<pattern id="pG5" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0H7M0 0V7" stroke="currentColor" strokeWidth=".8" fill="none" /></pattern>
</defs>
<symbol id="w1" viewBox="0 0 120 120">
<path d="M12 26L33 90Q39 106 46 90L55 66Q60 54 65 66L74 90Q81 106 87 90L100 50" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
<circle cx="107" cy="26" r="9" fill="var(--red)" />
</symbol>
<symbol id="w2" viewBox="0 0 120 120">
<path d="M12 26L33 90Q39 106 46 90L55 66Q60 54 65 66L74 90Q81 106 87 90L100 50" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
<circle cx="107" cy="26" r="9" fill="var(--ink)" />
</symbol>
</svg>
    </>
  );
}
