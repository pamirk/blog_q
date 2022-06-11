import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './EmailCheckboxList.module.scss';
import ExpandArrowDown from '../../../svgs/expand-arrow-down';
import {Button, Checkbox} from '../../../@quartz/interface';
import {withProps,} from '../../../helpers/wrappers';
import classnames from 'classnames/bind';
import {clickNewsletterCheckbox} from '../../../helpers/tracking/actions';
import useTracking from '../../../helpers/hooks/useTracking';
import emails, {emailList} from '../../../config/emails';

const cx = classnames.bind(styles);

const EmailCheckbox = ({handleChange, checkboxLabel, checked, emailDescription}) => (
    <li className={cx('checkbox-wrapper')}>
        <Checkbox
            checked={checked}
            onChange={handleChange}
            size="large"
        >
            <p className={cx('checkbox-title')}>
                {checkboxLabel}
            </p>
            {emailDescription && (
                <span className={cx('checkbox-copy')}>{emailDescription}</span>
            )}
        </Checkbox>
    </li>
);

EmailCheckbox.propTypes = {
    checkboxLabel: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    emailDescription: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
};

const EmailCheckboxInner = ({checkboxes}) => {
    const [visible, setVisible] = useState(false);
    const [checkedSlugs, setCheckedSlugs] = useState([]);

    return (
        <ul className={cx('checks')}>
            {
                checkboxes.map(({slug, checked, description, label, toggle, trackToggle}, idx) => {
                    // don't show all the checkboxes unless the user clicks the button
                    if (!visible && idx > 2) {
                        return null;
                    }

                    const toggleAndTrack = () => {
                        if (!checkedSlugs.includes(slug)) {
                            trackToggle();
                            setCheckedSlugs([slug, ...checkedSlugs]);
                        }
                        toggle();
                    };

                    return (
                        <EmailCheckbox
                            key={slug}
                            checkboxLabel={label || 'E-mail'}
                            checked={checked}
                            handleChange={toggleAndTrack}
                            emailDescription={description}
                        />
                    );
                })
            }
            {
                !visible && (
                    <li className={cx('view-more')}>
                        <Button inline={true} onClick={() => setVisible(true)}>
                            View all newsletters
                            <ExpandArrowDown className={cx('arrow-down')}/>
                        </Button>
                    </li>
                )
            }
        </ul>
    );
};

EmailCheckboxInner.propTypes = {
    checkboxes: PropTypes.arrayOf(PropTypes.object),
};

const EmailCheckboxList = withProps(({checkboxListSlugs, selectedSlugs, toggleCheckbox}) => ({
    // use the ordered email list to create a props object
    checkboxes: emailList.reduce((accum, slug) => {
        const email = emails[slug];
        const isCheckbox = checkboxListSlugs.includes(slug);
        // don't create a checkbox for something like Quartz Japan
        if (!email || !isCheckbox) {
            return accum;
        }
        const {name, shortDescription} = email;
        const toggle = () => toggleCheckbox(slug);
        const trackToggle = useTracking(clickNewsletterCheckbox, {listSlug: slug});
        const checked = selectedSlugs.includes(slug);
        return [...accum, {
            slug,
            toggle,
            trackToggle,
            checked,
            label: name,
            description: shortDescription,
        }];
    }, []),
}))(EmailCheckboxInner);

EmailCheckboxList.propTypes = {
    checkboxListSlugs: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedSlugs: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
};

export default EmailCheckboxList;
