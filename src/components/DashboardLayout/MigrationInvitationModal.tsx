import { Modal, ModalBody, ModalHeader } from 'components/common/Modal/SimpleModal';
import { connectModal } from 'redux-modal';

import Button from 'components/common/Button';

type Props = {
  show: boolean;
  handleHide: () => void;
}

export const MIGRATION_INVITATION_MODAL = 'MIGRATION_INVITATION_MODAL';

function MigrationInvitationModal(props: Props) {
    const {show, handleHide} = props;

  return (
    <Modal toggle={handleHide} isOpen={show}>
<ModalHeader toggle={handleHide}/>
<ModalBody>
<div className='title'>
Boost your treasury ops with Coinshift V2
</div>
    <div className='subtitle'>
      <b>

  We've whitelisted you for early access to Coinshift V2.
      </b>
      <br/>
      Manage your treasury from multiple chains & safes from a single dashboard. Use advanced features such as Stream payouts, Reporting, Transaction proposals & more.</div>
    <div className="d-flex justify-content-center align-items-center mt-4">
          <div>
            <Button
              onClick={handleHide}
              className="secondary mr-4"
            >
              Need Help?
            </Button>
          </div>
          <a href="https://beta.coinshift.xyz" rel="noreferer noopener" target="__blank">
            <Button>
              Go to Coinshift V2
            </Button>
          </a>
        </div>
</ModalBody>
    </Modal>
  )
}

export default connectModal({ name: MIGRATION_INVITATION_MODAL })(MigrationInvitationModal)