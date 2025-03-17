import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaFlag } from 'react-icons/fa';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Result
            icon={<FaFlag size={80} />}
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            }
            className="align-center"
        />
    );
}
