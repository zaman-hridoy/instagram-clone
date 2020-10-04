import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const AppLoader = () => (
    <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
    </Dimmer>
);

export default AppLoader;
