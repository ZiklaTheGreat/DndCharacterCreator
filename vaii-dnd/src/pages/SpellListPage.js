import React from 'react';
import "../styles/SpellListPageStyle.css";

function SpellListPage() {
    return (
        <div>
            <main className="content">
                <h2 className="page-subtitle">Spells</h2>

                <table className="spell-table">
                    <thead>
                        <tr>
                            <th>Spell Name</th>
                            <th>Level</th>
                            <th>School of Magic</th>
                            <th>Range</th>
                            <th>Casting Time</th>
                            <th>Concentration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><a href="#">Fireball</a></td>
                            <td>3</td>
                            <td>Evocation</td>
                            <td>150 feet</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Magic Missile</a></td>
                            <td>1</td>
                            <td>Evocation</td>
                            <td>120 feet</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Shield</a></td>
                            <td>1</td>
                            <td>Abjuration</td>
                            <td>Self</td>
                            <td>1 reaction</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Cure Wounds</a></td>
                            <td>1</td>
                            <td>Evocation</td>
                            <td>Touch</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Misty Step</a></td>
                            <td>2</td>
                            <td>Conjuration</td>
                            <td>Self (30 feet)</td>
                            <td>1 bonus action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Eldritch Blast</a></td>
                            <td>Cantrip</td>
                            <td>Evocation</td>
                            <td>120 feet</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Healing Word</a></td>
                            <td>1</td>
                            <td>Evocation</td>
                            <td>60 feet</td>
                            <td>1 bonus action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Counterspell</a></td>
                            <td>3</td>
                            <td>Abjuration</td>
                            <td>60 feet</td>
                            <td>1 reaction</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Hold Person</a></td>
                            <td>2</td>
                            <td>Enchantment</td>
                            <td>60 feet</td>
                            <td>1 action</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td><a href="#">Invisibility</a></td>
                            <td>2</td>
                            <td>Illusion</td>
                            <td>Touch</td>
                            <td>1 action</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td><a href="#">Dispel Magic</a></td>
                            <td>3</td>
                            <td>Abjuration</td>
                            <td>120 feet</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Lightning Bolt</a></td>
                            <td>3</td>
                            <td>Evocation</td>
                            <td>100 feet (line)</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Teleport</a></td>
                            <td>7</td>
                            <td>Conjuration</td>
                            <td>10 feet</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Mage Armor</a></td>
                            <td>1</td>
                            <td>Abjuration</td>
                            <td>Touch</td>
                            <td>1 action</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td><a href="#">Polymorph</a></td>
                            <td>4</td>
                            <td>Transmutation</td>
                            <td>60 feet</td>
                            <td>1 action</td>
                            <td>Yes</td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default SpellListPage;
