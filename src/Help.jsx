const Help = ({ closeAction }) => {
    return <>
        <div className="darkBG" onClick={closeAction} />
        <div className="overlayBox">
            <div className="overlayContent">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                                    <td className="command">gerade g D E</td>
                                    <td></td>
                                    <td>Zeichne die Gerade <span className="command">g</span> durch die Punkte <span className="command">D</span> und <span className="command">E</span></td>
                                </tr>
                                <tr>
                                    <td className="command">bez sp c g Z</td>
                                    <td></td>
                                    <td>Bezeichne den Schnittpunkt des Objekts <span className="command">c</span> mit Objekt <span className="command">g</span> als <span className="command">Z</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <h4>Über JS-Constri</h4>
                        Eine work-in-progress Reimplementierung von Constri in Javascript.<br/>Für mehr Informationen über Constri, siehe <a href="https://hupfeld-software.de/dokuwiki/doku.php/constri">hier</a> (nicht mein Inhalt, fremde Seite).
                    </div>
                </div>
            </div>
            <div>
                <button id="help_OkButton" onClick={closeAction}>OK</button>
            </div>
        </div>
    </>
}

export default Help