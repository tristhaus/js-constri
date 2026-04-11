const HelpDe = ({ closeAction }) => {
    return <>
        <div className="darkBG" onClick={closeAction} />
        <div className="overlayBox">
            <div className="overlayContent">
                <div id='helpBoxDe' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <h4>Hilfe</h4>
                        <table className="commandListing">
                            <thead>
                                <tr>
                                    <td>Beispiel</td>
                                    <td style={{ paddingLeft: 20 }}></td>
                                    <td>Beschreibung</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="command">punkt A -5.5 3</td>
                                    <td></td>
                                    <td>Zeichne den Punkt <span className="command">A</span> mit den Koordinaten (<span className="command">-5.5</span>, <span className="command">3</span>)</td>
                                </tr>
                                <tr>
                                    <td className="command">strecke c A B</td>
                                    <td></td>
                                    <td>Zeichne die Strecke <span className="command">c</span> von Punkt <span className="command">A</span> nach Punkt <span className="command">B</span></td>
                                </tr>
                                <tr>
                                    <td className="command">strahl de D E</td>
                                    <td></td>
                                    <td>Zeichne den Strahl <span className="command">de</span> ausgehend von <span className="command">D</span> durch <span className="command">E</span></td>
                                </tr>
                                <tr>
                                    <td className="command">gerade h F G</td>
                                    <td></td>
                                    <td>Zeichne die Gerade <span className="command">g</span> durch die Punkte <span className="command">F</span> und <span className="command">G</span></td>
                                </tr>
                                <tr>
                                    <td className="command">kreis k A 6.0</td>
                                    <td></td>
                                    <td>Zeichne den Kreis <span className="command">k</span> um den Mittelpunkt <span className="command">A</span> mit dem Radius <span className="command">6.0</span></td>
                                </tr>
                                <tr>
                                    <td className="command">winkel alpha ab A ac -30</td>
                                    <td></td>
                                    <td>Zeichne den Winkel <span className="command">alpha</span> an dem vorhandenen Objekt <span className="command">ab</span> mit dem Scheitelpunkt <span className="command">A</span> zum Strahl <span className="command">ac</span> mit <span className="command">30</span>° mit dem Uhrzeigersinn</td>
                                </tr>
                                <tr>
                                    <td className="command">bez sp c g Z</td>
                                    <td></td>
                                    <td>Bezeichne den Schnittpunkt des Objekts <span className="command">c</span> mit Objekt <span className="command">g</span> als <span className="command">Z</span>. Optional: ein weiterer Name.</td>
                                </tr>
                                <tr>
                                    <td className="command">poly A D C B</td>
                                    <td></td>
                                    <td>Zeichne das Polygon durch mindestens 3 Punkte <span className="command">A</span>, <span className="command">D</span>, <span className="command">C</span>, <span className="command">B</span></td>
                                </tr>
                                <tr>
                                    <td className="command">farbe gruen</td>
                                    <td></td>
                                    <td>Wechsel die Zeichenfarbe zu <span className="command">gruen</span>. Verfügbar: <span className="command">schwarz</span>, <span className="command">rot</span>, <span className="command">blau</span>, <span className="command">gruen</span>, <span className="command">gelb</span>.</td>
                                </tr>
                                <tr>
                                    <td className="command">loesche h Y</td>
                                    <td></td>
                                    <td>Lösche die Objekte <span className="command">h</span> und <span className="command">Y</span></td>
                                </tr>
                                <tr>
                                    <td className="command">loesche bez i X</td>
                                    <td></td>
                                    <td>Lösche die Namen der Objekte <span className="command">i</span> und <span className="command">X</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <h4>Über JS-Constri</h4>
                        Eine <a href="https://github.com/tristhaus/js-constri" target="_blank">open-source</a> work-in-progress Reimplementierung von Constri in Javascript.<br />Für mehr Informationen über Constri, siehe <a href="https://hupfeld-software.de/dokuwiki/doku.php/constri" target="_blank">hier</a> (nicht mein Inhalt, fremde Seite).
                    </div>
                </div>
            </div>
            <div>
                <button id="help_OkButton" onClick={closeAction}>OK</button>
            </div>
        </div>
    </>
}

const HelpEn = ({ closeAction }) => {
    return <>
        <div className="darkBG" onClick={closeAction} />
        <div className="overlayBox">
            <div className="overlayContent">
                <div id='helpBoxEn' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <h4>Help</h4>
                        <table className="commandListing">
                            <thead>
                                <tr>
                                    <td>Example</td>
                                    <td style={{ paddingLeft: 20 }}></td>
                                    <td>Description</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="command">point A -5.5 3</td>
                                    <td></td>
                                    <td>Draw the point <span className="command">A</span> with coordinates (<span className="command">-5.5</span>, <span className="command">3</span>)</td>
                                </tr>
                                <tr>
                                    <td className="command">segment c A B</td>
                                    <td></td>
                                    <td>Draw the line segment <span className="command">c</span> from point <span className="command">A</span> to point <span className="command">B</span></td>
                                </tr>
                                <tr>
                                    <td className="command">ray de D E</td>
                                    <td></td>
                                    <td>Draw the ray <span className="command">de</span> starting at point <span className="command">D</span> through point <span className="command">E</span></td>
                                </tr>
                                <tr>
                                    <td className="command">line h F G</td>
                                    <td></td>
                                    <td>Draw the infinite line <span className="command">h</span> through points <span className="command">F</span> and <span className="command">G</span></td>
                                </tr>
                                <tr>
                                    <td className="command">circle k A 6.0</td>
                                    <td></td>
                                    <td>Draw the circle <span className="command">k</span> centered on point <span className="command">A</span> with radius <span className="command">6.0</span></td>
                                </tr>
                                <tr>
                                    <td className="command">angle alpha ab A ac -30</td>
                                    <td></td>
                                    <td>Draw the angle <span className="command">alpha</span> starting at existing object <span className="command">ab</span> at vertex <span className="command">A</span> ending at new ray <span className="command">ac</span> with <span className="command">30</span>°, clockwise</td>
                                </tr>
                                <tr>
                                    <td className="command">name inter c g Z</td>
                                    <td></td>
                                    <td>Consider the intersection of objects <span className="command">c</span> and <span className="command">g</span>: give it the name <span className="command">Z</span>. Two names are possible.</td>
                                </tr>
                                <tr>
                                    <td className="command">poly A D C B</td>
                                    <td></td>
                                    <td>Draw the polygon through at least three points <span className="command">A</span>, <span className="command">D</span>, <span className="command">C</span>, <span className="command">B</span></td>
                                </tr>
                                <tr>
                                    <td className="command">color green</td>
                                    <td></td>
                                    <td>Change the drawing color to <span className="command">green</span>. Available: <span className="command">black</span>, <span className="command">red</span>, <span className="command">blue</span>, <span className="command">green</span>, <span className="command">yellow</span>.</td>
                                </tr>
                                <tr>
                                    <td className="command">delete h Y</td>
                                    <td></td>
                                    <td>Delete the objects <span className="command">h</span> and <span className="command">Y</span></td>
                                </tr>
                                <tr>
                                    <td className="command">delete name i X</td>
                                    <td></td>
                                    <td>Delete the labels of objects <span className="command">i</span> and <span className="command">X</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <h4>About JS-Constri</h4>
                        A <a href="https://github.com/tristhaus/js-constri" target="_blank">open-source</a> work-in-progress reimplementation of Constri in Javascript.<br />For more information about Constri (in German), see <a href="https://hupfeld-software.de/dokuwiki/doku.php/constri" target="_blank">here</a> (not my content, third-party site).
                    </div>
                </div>
            </div>
            <div>
                <button id="help_OkButton" onClick={closeAction}>OK</button>
            </div>
        </div>
    </>
}

export { HelpDe, HelpEn }