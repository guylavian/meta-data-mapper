import React from 'react';

const About: React.FC = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-2xl font-semibold">About Metadata Mapper</h2>
    <p>
      This tool helps map your API data to the Entity Metadata Manager (EMM)
      format. Load your metadata, select the desired fields and generate
      mapping rules with an easy to use interface.
    </p>
  </div>
);

export default About;
