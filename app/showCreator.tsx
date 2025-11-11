"use client";

export default function ShowCreator() {

  return (<div className="flex gap-3 flex-col">
    <div>
      <label htmlFor="showName">Show Name:</label>
      <input type="text" id="showName" className="border rounded-sm ml-3"/>
    </div>
    <div>
      <label htmlFor="episodeCount">Episodes:</label>
      <input type="number" id="episodeCount" className="border rounded-sm ml-3"/>
    </div>
    <div>
      <label htmlFor="dateStartSelect">Date:</label>
      <input type="" id="dateStartSelect" className="border rounded-sm ml-3"/>
    </div>

    <input type="button" value="Add Show" className="border max-w-50 rounded-sm"/>
    </div>);
}