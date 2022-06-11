import React, {useRef} from 'react';
import Router from 'next/router'
import {encodeSearchPath} from 'helpers/urls';
import {TextInput} from '@quartz/interface';

export default function SearchInput(props: {
    defaultValue?: string,
    onSubmit?: () => void,
}) {
    const {
        defaultValue, onSubmit = () => {
        }
    } = props;
    // const history = useHistory();
    const ref = useRef<HTMLInputElement>(null);

    function onSearchSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        onSubmit();

        const terms = encodeSearchPath(ref.current?.value ?? '');
        const path = terms ? `/search/${terms}/` : '/search/';

        // noinspection JSIgnoredPromiseFromCall
        Router.push(path);
    }

    return (
        <form
            onSubmit={onSearchSubmit}
            role="search"
        >
            <TextInput
                id="search"
                defaultValue={defaultValue}
                placeholder="Search Quartz"
                inputRef={ref}
                type="search"
            />
        </form>
    );
}
